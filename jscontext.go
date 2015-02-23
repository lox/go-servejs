package servejs

import (
	"errors"
	"fmt"
	"log"
	"reflect"

	"github.com/olebedev/go-duktape"
)

const jsInit = `
var self = {};
var console = {log:print,warn:print,error:print,info:print};
var window = {};
`

type jsContext struct {
	ctx *duktape.Context
}

func newJsContext() (*jsContext, error) {
	ctx := &jsContext{ctx: duktape.NewContext()}

	if _, err := ctx.Eval(jsInit); err != nil {
		return nil, err
	}

	return ctx, nil
}

func (c *jsContext) Eval(js string) (*jsResult, error) {
	c.ctx.PushGlobalObject()

	if code := c.ctx.PevalString(js); code != 0 {
		log.Printf("PevalString failed with code %d", code)
		c.ctx.GetPropString(-1, "lineNumber")
		return nil, fmt.Errorf("%s on line %s of eval'd js",
			c.ctx.SafeToString(-2), c.ctx.SafeToString(-1))
	}

	return &jsResult{c.ctx}, nil
}

func (c *jsContext) MustEval(js string) *jsResult {
	res, err := c.Eval(js)
	if err != nil {
		panic(err)
	}
	return res
}

func (c *jsContext) BindFunc(name string, f func(p *jsFunc)) error {
	c.ctx.PushGoFunc(name, func(dctx *duktape.Context) int {
		fo := &jsFunc{c.ctx}
		f(fo)
		return 1
	})
	return nil
}

type jsResult struct {
	ctx *duktape.Context
}

type jsFunc struct {
	ctx *duktape.Context
}

func (f *jsFunc) ReturnString(s string) {
	f.ctx.PushString(s)
}

func (f *jsFunc) Return(val interface{}) {
	if err := pushCompound(f.ctx, val); err != nil {
		panic(err)
	}
}

func (f *jsFunc) String(pos int) string {
	return f.ctx.GetString(1)
}

func (f *jsFunc) Int(pos int) int {
	return f.ctx.GetInt(1)
}

func (f *jsFunc) Args() []interface{} {
	args := make([]interface{}, f.Len())
	for i := 1; i <= f.Len(); i++ {
		args[i-1] = f.ctx.GetString(i)
	}
	return args
}

func (f *jsFunc) Len() int {
	return f.ctx.GetTop() - 1
}

func pushCompound(ctx *duktape.Context, obj interface{}) error {
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

func pushScalar(ctx *duktape.Context, val interface{}) error {
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
