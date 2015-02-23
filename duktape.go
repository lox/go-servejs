package servejs

import (
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"reflect"
	"strings"

	"github.com/olebedev/go-duktape"
)

const jsInit = `
var self = {},
    console = {log:print,warn:print,error:print,info:print},
    window = {},
    global = {};
`

// SrcFunc returns javascript source code
type SrcFunc func() ([]byte, error)

// File returns a SrcFunc for loading a given file of the filesystem
func File(path string) SrcFunc {
	return func() ([]byte, error) {
		b, err := ioutil.ReadFile(path)
		if err != nil {
			return nil, err
		}
		return b, nil
	}
}

type contextPool struct {
	ch chan *context
}

func (p *contextPool) get() *context {
	return <-p.ch
}

func (p *contextPool) release(ot *context) {
	p.ch <- ot
}

func newContextPool(size int, src SrcFunc) *contextPool {
	pool := &contextPool{
		ch: make(chan *context, size),
	}
	go func() {
		for i := 0; i < size; i++ {
			pool.ch <- newContext(src)
		}
	}()
	return pool
}

func (p *contextPool) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx := p.get()
	ctx.logger.Println("found a context")
	ctx.ServeHTTP(w, r)
	ctx.logger.Println("returned to pool")
	p.release(ctx)
}

type context struct {
	*duktape.Context
	logger *log.Logger
}

func newContext(src SrcFunc) *context {
	d := duktape.NewContext()
	ctx := &context{
		Context: d,
		logger:  log.New(os.Stdout, fmt.Sprintf("[vm %p] ", d), log.LstdFlags),
	}

	if err := evalString(ctx, jsInit); err != nil {
		panic(err)
	}

	// expose env variables to js
	ctx.PushGoFunc("__goEnv", func(_ *duktape.Context) int {
		if err := pushCompound(ctx, envVars()); err != nil {
			return 0
		}
		return 1
	})

	ctx.PushGoFunc("__goLog", func(_ *duktape.Context) int {
		ctx.logger.Println(ctx.GetString(1))
		return 1
	})

	appJs, err := src()
	if err != nil {
		panic(err)
	}

	// evaluate the app slug, should have a function on the stack
	if err := evalString(ctx, string(appJs)); err != nil {
		panic(err)
	}

	if !ctx.IsObject(1) {
		panic(errors.New("expected object to be returned by js"))
	}

	return ctx
}

func (ctx *context) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	errorCh := make(chan error)
	serveCh := make(chan bool)

	if !ctx.IsObject(1) {
		http.Error(w, "expected an object on js stack", http.StatusInternalServerError)
		return
	}

	ctx.PushGoFunc("__goHeader", func(_ *duktape.Context) int {
		w.Header().Set(ctx.GetString(1), ctx.GetString(2))
		return 1
	})

	ctx.PushGoFunc("__goWriteHeader", func(_ *duktape.Context) int {
		w.WriteHeader(ctx.GetInt(1))
		return 1
	})

	ctx.PushGoFunc("__goWrite", func(_ *duktape.Context) int {
		w.Write([]byte(ctx.GetString(1)))
		return 1
	})

	ctx.PushGoFunc("__goEnd", func(_ *duktape.Context) int {
		errorCh <- nil
		return 1
	})

	go func() {
		ctx.PushString("serve")
		pushCompound(ctx, map[string]string{
			"method": r.Method,
			"url":    r.URL.Path,
		})

		if ctx.PcallProp(1, 1) != 0 {
			errorCh <- errors.New("expected an object on js stack")
		}

		serveCh <- true
	}()

	defer ctx.Pop()
	err := <-errorCh
	<-serveCh

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func getError(ctx *context) error {
	ctx.GetPropString(-1, "lineNumber")
	return fmt.Errorf("%s on line %s of eval'd js",
		ctx.SafeToString(-2), ctx.SafeToString(-1))
}

func evalString(ctx *context, js string) error {
	if retCode := ctx.PevalString(js); retCode != 0 {
		return getError(ctx)
	}
	return nil
}

func envVars() map[string]string {
	env := map[string]string{}
	for _, e := range os.Environ() {
		pair := strings.SplitN(e, "=", 2)
		env[pair[0]] = pair[1]
	}
	return env
}

func pushCompound(ctx *context, obj interface{}) error {
	v := reflect.ValueOf(obj)
	objIdx := ctx.PushObject()

	switch v.Kind() {
	case reflect.Map:
		for _, key := range v.MapKeys() {
			val := v.MapIndex(key)
			stringKey, ok := key.Interface().(string)
			if !ok {
				return errors.New("Only string keys are supported in maps")
			}
			if err := pushScalar(ctx, val.Interface()); err != nil {
				return err
			}
			ctx.PutPropString(objIdx, stringKey)
		}
	default:
		return fmt.Errorf("Unhandled type %#v", v.Kind())
	}

	return nil
}

func pushScalar(ctx *context, val interface{}) error {
	switch typed := val.(type) {
	case int:
		ctx.PushInt(typed)
	case float64:
		ctx.PushNumber(typed)
	case string:
		ctx.PushString(typed)
	default:
		return fmt.Errorf("Unhandled scalar type %#v", typed)
	}
	return nil
}
