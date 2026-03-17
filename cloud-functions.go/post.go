package handler

import (
	"encoding/json"
	"io"
	"net/http"
)

type PostRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type PostResponse struct {
	Success bool        `json:"success"`
	Method  string      `json:"method"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method == http.MethodGet {
		json.NewEncoder(w).Encode(PostResponse{
			Success: true,
			Method:  "GET",
			Data:    "Send a POST request with JSON body {name, email, message}",
		})
		return
	}

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(PostResponse{
			Success: false,
			Method:  r.Method,
			Error:   "Only GET and POST methods are allowed",
		})
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(PostResponse{
			Success: false,
			Method:  "POST",
			Error:   "Error reading request body",
		})
		return
	}
	defer r.Body.Close()

	if len(body) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(PostResponse{
			Success: false,
			Method:  "POST",
			Error:   "Request body is empty. Send JSON like: {\"name\":\"test\",\"email\":\"a@b.com\",\"message\":\"hi\"}",
		})
		return
	}

	var req PostRequest
	if err := json.Unmarshal(body, &req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(PostResponse{
			Success: false,
			Method:  "POST",
			Error:   "Invalid JSON: " + err.Error(),
		})
		return
	}

	json.NewEncoder(w).Encode(PostResponse{
		Success: true,
		Method:  "POST",
		Data: map[string]string{
			"name":    req.Name,
			"email":   req.Email,
			"message": req.Message,
		},
	})
}
