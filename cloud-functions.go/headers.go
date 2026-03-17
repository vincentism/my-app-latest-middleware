package handler

import (
	"encoding/json"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("X-Custom-Header", "GoFunction")
	w.Header().Set("X-Powered-By", "Vercel-Go")

	// 收集所有请求头
	headers := make(map[string]string)
	for key, values := range r.Header {
		headers[key] = values[0]
	}

	resp := map[string]interface{}{
		"message":          "Headers demo",
		"user_agent":       r.Header.Get("User-Agent"),
		"accept":           r.Header.Get("Accept"),
		"request_headers":  headers,
	}

	json.NewEncoder(w).Encode(resp)
}
