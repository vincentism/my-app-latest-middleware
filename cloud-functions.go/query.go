package handler

import (
	"encoding/json"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	name := r.URL.Query().Get("name")
	if name == "" {
		name = "World"
	}

	age := r.URL.Query().Get("age")
	if age == "" {
		age = "unknown"
	}

	resp := map[string]string{
		"message": "Hello, " + name + "!",
		"name":    name,
		"age":     age,
		"raw":     r.URL.RawQuery,
	}

	json.NewEncoder(w).Encode(resp)
}
