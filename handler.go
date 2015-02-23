package servejs

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type Handler struct {
	f      *os.File
	src    bytes.Buffer
	loaded bool
	sync.Mutex
}

func New(f *os.File) *Handler {
	return &Handler{f: f}
}

func (e *Handler) loadSrc() error {
	if !e.loaded && e.f != nil {
		if _, err := io.Copy(&e.src, e.f); err != nil {
			return err
		}
		e.loaded = true
	}
	return nil
}

func (e *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	ctx, err := newJsContext()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := e.loadSrc(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	errorCh := make(chan error)

	go func() {
		ctx.BindFunc("__goEnv", func(f *jsFunc) {
			env := map[string]string{}
			for _, e := range os.Environ() {
				pair := strings.SplitN(e, "=", 2)
				env[pair[0]] = pair[1]
			}
			f.Return(env)
		})

		ctx.BindFunc("__goLog", func(f *jsFunc) {
			args := f.Args()
			log.Printf(args[0].(string), args[1:]...)
		})

		ctx.BindFunc("__goWrite", func(f *jsFunc) {
			w.Write([]byte(f.String(1)))
		})

		ctx.BindFunc("__goEnd", func(f *jsFunc) {
			errorCh <- nil
		})

		ctx.BindFunc("__goRequest", func(f *jsFunc) {
			f.ReturnString(handleRequest(f.String(1)))
		})

		_, err = ctx.Eval(e.src.String())
		if err != nil {
			errorCh <- err
		}
	}()

	select {
	case err = <-errorCh:
	case <-time.After(time.Second * 2):
		err = errors.New("timed out waiting for response from js")
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func handleRequest(j string) string {
	var req struct {
		Settings struct {
			Method         string
			URL            string
			Async          bool
			User, Password string
		}
		Headers map[string]string
		Body    string
	}
	res := map[string]interface{}{}

	dec := json.NewDecoder(strings.NewReader(j))
	if err := dec.Decode(&req); err != nil {
		panic(err)
	}

	request, err := http.NewRequest(
		req.Settings.Method,
		req.Settings.URL,
		strings.NewReader(req.Body),
	)
	if err != nil {
		res["code"] = http.StatusBadRequest
		res["body"] = err.Error()
	}

	resp, err := http.DefaultClient.Do(request)
	if err != nil {
		res["code"] = http.StatusInternalServerError
		res["body"] = err.Error()
	}
	defer resp.Body.Close()

	rheaders := map[string][]string{}
	for k, v := range resp.Header {
		rheaders[k] = v
	}
	res["headers"] = rheaders

	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		res["code"] = http.StatusInternalServerError
		res["body"] = err.Error()
	}

	res["code"] = resp.StatusCode
	res["body"] = string(b)

	resB, _ := json.Marshal(res)
	return string(resB)
}
