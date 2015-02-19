package servejs

import (
	"errors"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"
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
	defer ctx.Destroy()

	log.Printf("serving context %#v", ctx)

	errorCh := make(chan error)
	go func() {
		ctx.BindFunc("__goWrite", func(f *jsFunc) {
			log.Printf("called __goWrite")
			w.Write([]byte(f.String(1)))
		})

		ctx.BindFunc("__goEnd", func(f *jsFunc) {
			log.Printf("called __goEnd")
			errorCh <- nil
		})

		log.Printf("evaluating app js")
		_, err = ctx.Eval(string(src))
		if err != nil {
			errorCh <- err
		}
	}()

	log.Printf("waiting for js to call end")
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
