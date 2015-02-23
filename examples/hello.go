package main

import (
	"net/http"

	"github.com/lox/go-servejs"
)

func main() {
	http.Handle("/", servejs.NewHandler(servejs.File("./build/hello.js")))
	http.HandleFunc("/favicon.ico", http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "Not Found", http.StatusNotFound)
	}))
	http.ListenAndServe(":3000", nil)
}
