package servejs

import (
	"bytes"
	"errors"
	"io"
	"net/http"
	"os"
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
		ctx.BindFunc("__goWrite", func(f *jsFunc) {
			w.Write([]byte(f.String(1)))
		})

		ctx.BindFunc("__goEnd", func(f *jsFunc) {
			errorCh <- nil
		})

		_, err = ctx.Eval(e.src.String())
		if err != nil {
			errorCh <- err
		}
	}()

	select {
	case err = <-errorCh:
	case <-time.After(time.Second * 1):
		err = errors.New("timed out waiting for response from js")
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
