package servejs

import (
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

type Handler struct {
	js io.Reader
}

func New(f *os.File) *Handler {
	return &Handler{f}
}

func (e *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	src, err := ioutil.ReadAll(e.js)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	ctx, err := newJsContext()
	if err != nil {
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

		log.Printf("evaluating app js")
		_, err = ctx.Eval(string(src))
		if err != nil {
			errorCh <- err
		}
	}()

	err = <-errorCh
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
