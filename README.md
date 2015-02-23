go-servejs
==========

A golang and npm package to serve server-side javascript via duktape in a Golang http.Handler context.

Usage
-----

Usage relies on using Webpack to build a single javascript file to serve. 

Example
-------

In go:

```go
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
```

In js:

```js
var servejs = require('go-servejs');
var app = servejs()

// store our message to display
var message = "Hello World!"

// register a route
app.get('/', function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(message + '\n');
})

// listen for requests
app.listen();
```