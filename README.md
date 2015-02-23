go-servejs
==========

A golang and npm package to serve server-side javascript via duktape in a Golang http.Handler context.

Status
------

This is a prototype, at best an experiment. Please don't use for anything that needs to actually work.

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
	http.Handle("/", servejs.NewHandler(servejs.File("./build/hello.js")))
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
```