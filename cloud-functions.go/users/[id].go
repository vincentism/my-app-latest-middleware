package handler

import (
	"encoding/json"
	"net/http"
	"strings"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 从路径中提取动态参数
	parts := strings.Split(r.URL.Path, "/")
	id := parts[len(parts)-1]

	resp := map[string]string{
		"message": "User detail",
		"id":      id,
		"path":    r.URL.Path,
		"method":  r.Method,
	}

	json.NewEncoder(w).Encode(resp)
}
