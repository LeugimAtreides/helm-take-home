package models

// Claim represents a single claim from claims.json
type Claim struct {
	ClaimID          string  `json:"claimId"`
	MemberID         string  `json:"memberId"`
	ProviderName     string  `json:"providerName"`
	Status           string  `json:"status"`
	AmountCents      int64   `json:"amountCents"`
	ServiceDate      string  `json:"serviceDate"`
	ReceivedAt       string  `json:"receivedAt"`
	UpdatedAt        string  `json:"updatedAt"`
	ClaimType        string  `json:"claimType"`
	NetworkStatus    string  `json:"networkStatus"`
	PlanName         string  `json:"planName"`
	FlaggedForReview bool    `json:"flaggedForReview"`
	DenialReason     *string `json:"denial_reason,omitempty"`
}

// Claims is a slice of Claim for unmarshaling the claims.json array
type Claims []Claim

// ClaimsSummary aggregates key metrics across claims
type ClaimsSummary struct {
	TotalClaims      int   `json:"totalClaims"`
	TotalApproved    int   `json:"totalApproved"`
	TotalDenied      int   `json:"totalDenied"`
	TotalPending     int   `json:"totalPending"`
	TotalAmountCents int64 `json:"totalAmountCents"`
	FlaggedCount     int   `json:"flaggedCount"`
}
