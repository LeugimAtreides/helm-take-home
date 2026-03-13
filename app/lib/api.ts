import { Claim, ClaimsSummary } from "@/lib/types";

export async function fetchClaims(
  query: string,
  signal?: AbortSignal
): Promise<Claim[]> {
  const res = await fetch(`/go-api/claims?${query}`, { signal });
  if (!res.ok) throw new Error("Failed to fetch claims");
  return res.json();
}

export async function fetchClaimsSummary(
  query: string,
  signal?: AbortSignal
): Promise<ClaimsSummary> {
  const res = await fetch(`/go-api/claims/summary?${query}`, { signal });
  if (!res.ok) throw new Error("Failed to fetch summary");
  return res.json();
}
