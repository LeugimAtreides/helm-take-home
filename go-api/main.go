package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"senior-full-stack/go-api/handlers"
	"senior-full-stack/go-api/services"
)

type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

func main() {
	mux := http.NewServeMux()
	claims, err := services.LoadClaimsFromJSON("../data/claims.json")
	if err != nil {
		log.Fatalf("failed to load claims dataset: %v", err)
	}
	claimsHandler := handlers.NewClaimsHandler(claims)

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(HealthResponse{
			Status:    "ok",
			Timestamp: time.Now().UTC().Format(time.RFC3339),
		})
	})

	mux.HandleFunc("GET /message", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(MessageResponse{
			Message: "Hello from the Go API!",
		})
	})
	mux.HandleFunc("GET /claims", claimsHandler.GetClaims)
	mux.HandleFunc("GET /claims/summary", claimsHandler.GetClaimsSummary)

	log.Println("Go API server starting on :8081")
	if err := http.ListenAndServe(":8081", mux); err != nil {
		log.Fatal(err)
	}
}
