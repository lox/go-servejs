package main

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/lox/go-servejs"
)

func get(url string) (res *http.Response, body []byte, err error) {
	res, err = http.Get(url)
	if err != nil {
		return
	}
	body, err = ioutil.ReadAll(res.Body)
	res.Body.Close()
	return
}

func TestHelloWorld(t *testing.T) {
	ts := httptest.NewServer(servejs.NewHandler(servejs.File("./hello.dist.js")))
	defer ts.Close()

	resp, body, err := get(ts.URL)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Got status %s, expected OK", resp.Status)
	}
	if string(body) != "Hello World!\n" {
		t.Fatalf("Got body %q, expected 'Hello World!\n'", string(body))
	}
}

func BenchmarkHelloWorld(b *testing.B) {
	b.StopTimer()
	ts := httptest.NewServer(servejs.NewHandler(servejs.File("./hello.dist.js")))
	defer ts.Close()
	b.StartTimer()

	for i := 0; i < b.N; i++ {
		resp, _, err := get(ts.URL)
		if err != nil {
			b.Fatal(err)
		}
		if resp.StatusCode != http.StatusOK {
			b.Fatalf("Got status %s, expected OK", resp.Status)
		}
	}
}
