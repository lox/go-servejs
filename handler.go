package servejs

import (
	"net/http"
	"runtime"
)

var PoolSize = runtime.NumCPU()

type Handler struct {
	pool *contextPool
}

func NewHandler(src SrcFunc) *Handler {
	return &Handler{pool: newContextPool(PoolSize, src)}
}

func (e *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	e.pool.ServeHTTP(w, r)
}
