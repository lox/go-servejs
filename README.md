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
var serve = require('go-servejs');

serve(function (req, res) {
  res.send('Hello World');
  res.end();
})
```