export type ClaimStatus = "approved" | "pending" | "denied";

export type NetworkStatus = "in_network" | "out_of_network";

export type Filters = {
  status: string;
  providerName: string;
  claimType: string;
  networkStatus: string;
  planName: string;
  serviceFrom: string;
  serviceTo: string;
  flagged: "" | "true" | "false";
};

export type Claim = {
  claimId: string;
  memberId: string;
  providerName: string;
  status: ClaimStatus;
  amountCents: number;
  serviceDate: string;
  receivedAt: string;
  updatedAt: string;
  claimType: string;
  networkStatus: NetworkStatus;
  planName: string;
  flaggedForReview: boolean;
  denialReason?: string;
  denial_reason?: string;
};

export type ClaimsSummary = {
  totalClaims: number;
  totalAmountCents: number;
  totalApproved: number;
  totalPending: number;
  totalDenied: number;
  flaggedCount: number;
};
