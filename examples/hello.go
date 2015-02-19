package main

import (
	"net/http"
	"os"

	"github.com/lox/go-servejs"
)

func main() {
	f, err := os.Open("./build/hello.js")
	if err != nil {
		panic(err)
	}

	http.Handle("/", servejs.New(f))
	http.ListenAndServe(":8000", nil)
}
