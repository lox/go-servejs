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
	http.HandleFunc("/favicon.ico", http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "Not Found", http.StatusNotFound)
	}))
	http.ListenAndServe(":3000", nil)
}
