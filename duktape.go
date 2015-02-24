package servejs

import (
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"time"

	"github.com/olebedev/go-duktape"
)

var ServerTimeout = time.Second * 15

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
	ctx.ServeHTTP(w, r)
	p.release(ctx)
}

type context struct {
	*duktape.Context
	appIdx int
	logger io.Writer
}

func newContext(src SrcFunc) *context {
	d := duktape.NewContext()
	ctx := &context{
		Context: d,
	}

	if err := evalString(ctx, jsInit); err != nil {
		panic(err)
	}

	// expose env variables to js
	ctx.PushGoFunc("__goEnv", func(_ *duktape.Context) int {
		if err := pushReflect(ctx, envVars()); err != nil {
			return 0
		}
		return 1
	})

	ctx.PushGoFunc("__goLog", func(_ *duktape.Context) int {
		log.Println(ctx.GetString(1))
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

	ctx.appIdx = ctx.GetTopIndex()
	return ctx
}

func (ctx *context) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	errorCh := make(chan error)
	serveCh := make(chan bool)

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

	ctx.PushGoFunc("__goServeStatic", func(_ *duktape.Context) int {
		path := filepath.Join(strings.TrimPrefix(ctx.GetString(1), "//"), ctx.GetString(2))
		log.Printf("serving static file %s", path)
		http.ServeFile(w, r, path)
		errorCh <- nil
		return 1
	})

	ctx.PushGoFunc("__goEnd", func(_ *duktape.Context) int {
		errorCh <- nil
		return 1
	})

	ctx.PushString("serve")
	err := pushReflect(ctx, map[string]interface{}{
		"method":   r.Method,
		"url":      r.URL.String(),
		"path":     r.URL.Path,
		"query":    jsQueryString(r.URL.Query()),
		"protocol": r.URL.Scheme,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	go func() {
		if ctx.PcallProp(ctx.appIdx, 1) != 0 {
			errorCh <- getError(ctx)
		}
		serveCh <- true
	}()

	select {
	case err = <-errorCh:
	case <-time.After(ServerTimeout):
		ctx.DumpContextStdout()
		http.Error(w, "Timed out waiting for server response",
			http.StatusGatewayTimeout)
		return
	}

	<-serveCh
	defer ctx.Pop()

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func jsQueryString(values url.Values) map[string]interface{} {
	return map[string]interface{}{}
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

func pushReflect(ctx *context, obj interface{}) error {
	v := reflect.ValueOf(obj)

	switch v.Kind() {
	case reflect.Map:
		return pushReflectMap(ctx, obj)
	case reflect.Int:
		ctx.PushInt(obj.(int))
	case reflect.Float64:
		ctx.PushNumber(obj.(float64))
	case reflect.String:
		ctx.PushString(obj.(string))
	default:
		return fmt.Errorf("Unhandled type %#v", v.Kind())
	}

	return nil
}

func pushReflectMap(ctx *context, obj interface{}) error {
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
			if err := pushReflect(ctx, val.Interface()); err != nil {
				return err
			}
			ctx.PutPropString(objIdx, stringKey)
		}
	default:
		return fmt.Errorf("Unhandled type %#v", v.Kind())
	}

	return nil
}
