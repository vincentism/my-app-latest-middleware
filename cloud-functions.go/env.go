package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"runtime"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	resp := map[string]interface{}{
		"message":     "Environment variables demo",
		"go_version":  runtime.Version(),
		"go_os":       runtime.GOOS,
		"go_arch":     runtime.GOARCH,
		"num_cpu":     runtime.NumCPU(),
		"VERCEL":      os.Getenv("VERCEL"),
		"VERCEL_ENV":  os.Getenv("VERCEL_ENV"),
		"VERCEL_URL":  os.Getenv("VERCEL_URL"),
		"VERCEL_REGION": os.Getenv("VERCEL_REGION"),
		"MY_CUSTOM_VAR": os.Getenv("MY_CUSTOM_VAR"),
	}

	json.NewEncoder(w).Encode(resp)
}
