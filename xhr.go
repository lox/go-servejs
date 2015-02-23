package servejs

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

func handleRequest(j string) string {
	var req struct {
		Settings struct {
			Method         string
			URL            string
			Async          bool
			User, Password string
		}
		Headers map[string]string
		Body    string
	}
	res := map[string]interface{}{}

	dec := json.NewDecoder(strings.NewReader(j))
	if err := dec.Decode(&req); err != nil {
		panic(err)
	}

	request, err := http.NewRequest(
		req.Settings.Method,
		req.Settings.URL,
		strings.NewReader(req.Body),
	)
	if err != nil {
		res["code"] = http.StatusBadRequest
		res["body"] = err.Error()
	}

	resp, err := http.DefaultClient.Do(request)
	if err != nil {
		res["code"] = http.StatusInternalServerError
		res["body"] = err.Error()
	}
	defer resp.Body.Close()

	rheaders := map[string][]string{}
	for k, v := range resp.Header {
		rheaders[k] = v
	}
	res["headers"] = rheaders

	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		res["code"] = http.StatusInternalServerError
		res["body"] = err.Error()
	}

	res["code"] = resp.StatusCode
	res["body"] = string(b)

	resB, _ := json.Marshal(res)
	return string(resB)
}
