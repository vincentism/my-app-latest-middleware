package handler

import (
	"encoding/json"
	"net/http"
	"runtime"
	"time"
)

type InfoResponse struct {
	Message   string `json:"message"`
	GoVersion string `json:"go_version"`
	Timestamp string `json:"timestamp"`
	Status    int    `json:"status"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	resp := InfoResponse{
		Message:   "Hello from Go JSON handler!",
		GoVersion: runtime.Version(),
		Timestamp: time.Now().Format(time.RFC3339),
		Status:    200,
	}

	json.NewEncoder(w).Encode(resp)
}
