package handler

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
)

var router *chi.Mux

func init() {
	router = chi.NewRouter()
	router.Use(chimw.Logger)
	router.Use(chimw.Recoverer)

	router.Get("/api/chi", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message":   "Hello from Chi on Vercel!",
			"framework": "chi",
		})
	})

	router.Get("/api/chi/users/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "User detail from Chi",
			"id":      id,
		})
	})

	router.Post("/api/chi", func(w http.ResponseWriter, r *http.Request) {
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "POST received via Chi",
			"data":    body,
		})
	})
}

func Handler(w http.ResponseWriter, r *http.Request) {
	router.ServeHTTP(w, r)
}
