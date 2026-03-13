package handlers

import (
	"encoding/json"
	"net/http"

	"senior-full-stack/go-api/models"
	"senior-full-stack/go-api/services"
)

// ClaimsHandler serves claims endpoints backed by a JSON claims dataset.
type ClaimsHandler struct {
	Claims models.Claims
}

// NewClaimsHandler constructs a claims handler with preloaded claims.
func NewClaimsHandler(claims models.Claims) *ClaimsHandler {
	return &ClaimsHandler{Claims: claims}
}

// GetClaims handles GET /claims.
func (h *ClaimsHandler) GetClaims(w http.ResponseWriter, r *http.Request) {
	filters, err := parseFilters(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	filtered, err := services.FilterClaims(h.Claims, filters)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, filtered)
}

// GetClaimsSummary handles GET /claims/summary.
func (h *ClaimsHandler) GetClaimsSummary(w http.ResponseWriter, r *http.Request) {
	filters, err := parseFilters(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	filtered, err := services.FilterClaims(h.Claims, filters)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	summary := services.BuildSummary(filtered)
	writeJSON(w, http.StatusOK, summary)
}

func parseFilters(r *http.Request) (services.ClaimFilters, error) {
	query := r.URL.Query()

	flagged, err := services.ParseFlaggedParam(query.Get("flagged"))
	if err != nil {
		return services.ClaimFilters{}, err
	}

	return services.ClaimFilters{
		Status:        query.Get("status"),
		ProviderName:  query.Get("providerName"),
		ClaimType:     query.Get("claimType"),
		NetworkStatus: query.Get("networkStatus"),
		PlanName:      query.Get("planName"),
		Flagged:       flagged,
		ServiceFrom:   query.Get("serviceFrom"),
		ServiceTo:     query.Get("serviceTo"),
	}, nil
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
