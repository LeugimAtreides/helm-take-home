package services

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"senior-full-stack/go-api/models"
)

// ClaimFilters defines optional server-side filters for claims queries.
type ClaimFilters struct {
	Status       string
	ProviderName string
	ClaimType    string
	NetworkStatus string
	PlanName     string
	Flagged      *bool
	ServiceFrom  string
	ServiceTo    string
}

// LoadClaimsFromJSON loads and unmarshals claims from a JSON file path.
func LoadClaimsFromJSON(filePath string) (models.Claims, error) {
	bytes, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("read claims file: %w", err)
	}

	var claims models.Claims
	if err := json.Unmarshal(bytes, &claims); err != nil {
		return nil, fmt.Errorf("unmarshal claims JSON: %w", err)
	}

	return claims, nil
}

// FilterClaims applies all provided filters and returns matching claims.
func FilterClaims(claims models.Claims, filters ClaimFilters) (models.Claims, error) {
	var fromDate time.Time
	var toDate time.Time
	var hasFrom bool
	var hasTo bool

	if strings.TrimSpace(filters.ServiceFrom) != "" {
		parsed, err := time.Parse("2006-01-02", filters.ServiceFrom)
		if err != nil {
			return nil, fmt.Errorf("invalid serviceFrom date %q, expected YYYY-MM-DD", filters.ServiceFrom)
		}
		fromDate = parsed
		hasFrom = true
	}

	if strings.TrimSpace(filters.ServiceTo) != "" {
		parsed, err := time.Parse("2006-01-02", filters.ServiceTo)
		if err != nil {
			return nil, fmt.Errorf("invalid serviceTo date %q, expected YYYY-MM-DD", filters.ServiceTo)
		}
		toDate = parsed
		hasTo = true
	}

	statusFilter := strings.TrimSpace(filters.Status)
	providerFilter := strings.TrimSpace(filters.ProviderName)
	typeFilter := strings.TrimSpace(filters.ClaimType)
	networkFilter := strings.TrimSpace(filters.NetworkStatus)
	planFilter := strings.TrimSpace(filters.PlanName)
	providerFilterFolded := strings.ToLower(providerFilter)

	filtered := make(models.Claims, 0, len(claims))
	for _, claim := range claims {
		if statusFilter != "" && claim.Status != statusFilter {
			continue
		}
		if providerFilter != "" && !strings.Contains(strings.ToLower(strings.TrimSpace(claim.ProviderName)), providerFilterFolded) {
			continue
		}
		if typeFilter != "" && claim.ClaimType != typeFilter {
			continue
		}
		if networkFilter != "" && claim.NetworkStatus != networkFilter {
			continue
		}
		if planFilter != "" && claim.PlanName != planFilter {
			continue
		}
		if filters.Flagged != nil && claim.FlaggedForReview != *filters.Flagged {
			continue
		}

		if hasFrom || hasTo {
			serviceDate, err := time.Parse("2006-01-02", claim.ServiceDate)
			if err != nil {
				return nil, fmt.Errorf("invalid claim serviceDate %q for claim %s", claim.ServiceDate, claim.ClaimID)
			}
			if hasFrom && serviceDate.Before(fromDate) {
				continue
			}
			if hasTo && serviceDate.After(toDate) {
				continue
			}
		}

		filtered = append(filtered, claim)
	}

	return filtered, nil
}

// BuildSummary computes top-level metrics from a claims slice.
func BuildSummary(claims models.Claims) models.ClaimsSummary {
	summary := models.ClaimsSummary{
		TotalClaims: len(claims),
	}

	for _, claim := range claims {
		switch claim.Status {
		case "approved":
			summary.TotalApproved++
		case "denied":
			summary.TotalDenied++
		case "pending":
			summary.TotalPending++
		}

		summary.TotalAmountCents += claim.AmountCents
		if claim.FlaggedForReview {
			summary.FlaggedCount++
		}
	}

	return summary
}

// ParseFlaggedParam converts a string query value into a tri-state bool pointer.
// Empty input means "no flagged filter" and returns nil, nil.
func ParseFlaggedParam(raw string) (*bool, error) {
	normalized := strings.ToLower(strings.TrimSpace(raw))
	if normalized == "" {
		return nil, nil
	}

	switch normalized {
	case "true", "1", "yes":
		v := true
		return &v, nil
	case "false", "0", "no":
		v := false
		return &v, nil
	default:
		return nil, fmt.Errorf("invalid flagged value %q, expected true/false", raw)
	}
}
