package servejs

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
)

func BenchmarkHelloWorldExample(b *testing.B) {
	b.StopTimer()

	f, err := os.Open("./build/hello.js")
	if err != nil {
		b.Fatal(err)
	}

	ts := httptest.NewServer(New(f))
	defer ts.Close()

	b.StartTimer() //restart timer
	for i := 0; i < b.N; i++ {
		res, err := http.Get(ts.URL)
		if err != nil {
			b.Fatal(err)
		}
		body, err := ioutil.ReadAll(res.Body)
		res.Body.Close()
		if err != nil {
			b.Fatal(err)
		}
		if res.StatusCode != http.StatusOK {
			log.Printf("response: %s", body)
			b.Fatalf("Got status %s, expected OK", res.Status)
		}
	}
}
