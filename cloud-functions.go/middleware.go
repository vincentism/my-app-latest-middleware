package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// CORS 中间件
func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

// 计时中间件
func withTiming(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next(w, r)
		duration := time.Since(start)
		w.Header().Set("X-Response-Time", fmt.Sprintf("%dms", duration.Milliseconds()))
	}
}

func actualHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	resp := map[string]interface{}{
		"message":   "Middleware demo - CORS + Timing",
		"method":    r.Method,
		"timestamp": time.Now().Format(time.RFC3339),
	}

	json.NewEncoder(w).Encode(resp)
}

// 组合中间件
func Handler(w http.ResponseWriter, r *http.Request) {
	withCORS(withTiming(actualHandler))(w, r)
}
