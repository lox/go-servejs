package servejs

import (
	"fmt"

	"github.com/olebedev/go-duktape"
)

const jsInit = `
	var self = {}, console = {log:print,warn:print,error:print,info:print}, window = {};
	`

type jsContext struct {
	ctx         *duktape.Context
	RequireFunc func(id string) (string, error)
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

	if c.ctx.PevalString(js) != 0 {
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

func (f *jsFunc) String(pos int) string {
	return f.ctx.GetString(1)
}
