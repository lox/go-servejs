package main

import (
	"log"
	"net/http"

	"github.com/lox/go-servejs"
)

func main() {
	// serve the favicon so it doesn't clutter our logs
	http.HandleFunc("/favicon.ico", http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		http.Error(w, "Not Found", http.StatusNotFound)
	}))

	// serve out hello world packed js file
	http.Handle("/", servejs.NewHandler(servejs.File("./hello.dist.js")))

	log.Println("Listening on http://localhost:3000")
	http.ListenAndServe(":3000", nil)
}
