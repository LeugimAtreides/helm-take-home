"use client";

import { useEffect, useState } from "react";
import { fetchClaims, fetchClaimsSummary } from "@/lib/api";
import { Filters, Claim, ClaimsSummary } from "@/lib/types";
import { formatLabel } from "@/lib/formatters";
import ClaimsFilters from "@/components/claimsFilters";
import ClaimsTable from "@/components/claimsTable";
import MetricCard from "@/components/metricCard";

const defaultFilters: Filters = {
  status: "",
  providerName: "",
  claimType: "",
  networkStatus: "",
  planName: "",
  serviceFrom: "",
  serviceTo: "",
  flagged: "",
};

export default function ClaimsDashboard() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedFilters, setSelectedFilters] = useState<(keyof Filters)[]>([]);

  const [claims, setClaims] = useState<Claim[]>([]);
  const [summary, setSummary] = useState<ClaimsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (filters.status) params.set("status", filters.status);
        if (filters.providerName)
          params.set("providerName", filters.providerName);
        if (filters.claimType) params.set("claimType", filters.claimType);
        if (filters.networkStatus)
          params.set("networkStatus", filters.networkStatus);
        if (filters.planName) params.set("planName", filters.planName);
        if (filters.serviceFrom) params.set("serviceFrom", filters.serviceFrom);
        if (filters.serviceTo) params.set("serviceTo", filters.serviceTo);
        if (filters.flagged) params.set("flagged", filters.flagged);

        const query = params.toString();

        const [claimsData, summaryData] = await Promise.all([
          fetchClaims(query, controller.signal),
          fetchClaimsSummary(query, controller.signal),
        ]);

        if (controller.signal.aborted) return;
        setClaims(claimsData);
        setSummary(summaryData);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setClaims([]);
        setSummary(null);
        setError("Failed to load claims data.");
      } finally {
        if (controller.signal.aborted) return;
        setLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [filters]);

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev: Filters) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(defaultFilters);
    setSelectedFilters([]);
  }

  function removeFilter<K extends keyof Filters>(key: K) {
    setFilters((prev) => ({ ...prev, [key]: defaultFilters[key] }));
    setSelectedFilters((prev) => prev.filter((existingKey) => existingKey !== key));
  }

  function addFilter(key: keyof Filters) {
    setSelectedFilters((prev) => {
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
  }

  const appliedFilters = [
    filters.status
      ? {
          key: "status" as const,
          label: `Status: ${formatLabel(filters.status)}`,
        }
      : null,
    filters.providerName
      ? {
          key: "providerName" as const,
          label: `Provider: ${filters.providerName}`,
        }
      : null,
    filters.claimType
      ? {
          key: "claimType" as const,
          label: `Type: ${formatLabel(filters.claimType)}`,
        }
      : null,
    filters.networkStatus
      ? {
          key: "networkStatus" as const,
          label: `Network: ${formatLabel(filters.networkStatus)}`,
        }
      : null,
    filters.planName
      ? {
          key: "planName" as const,
          label: `Plan: ${filters.planName}`,
        }
      : null,
    filters.serviceFrom
      ? {
          key: "serviceFrom" as const,
          label: `From: ${filters.serviceFrom}`,
        }
      : null,
    filters.serviceTo
      ? {
          key: "serviceTo" as const,
          label: `To: ${filters.serviceTo}`,
        }
      : null,
    filters.flagged
      ? {
          key: "flagged" as const,
          label:
            filters.flagged === "true" ? "Flagged Only" : "Not Flagged",
        }
      : null,
  ].filter((item): item is { key: keyof Filters; label: string } => item !== null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Claims Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            Explore claim activity and identify potential issues.
          </p>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Claims" value={summary.totalClaims} />
          <MetricCard
            title="Total Claim Value"
            value={summary.totalAmountCents}
            currency
          />
          <MetricCard title="Denied Claims" value={summary.totalDenied} />
          <MetricCard
            title="Flagged for Review"
            value={summary.flaggedCount}
          />
        </div>
      )}

      <ClaimsFilters
        filters={filters}
        selectedFilters={selectedFilters}
        addFilter={addFilter}
        removeFilter={removeFilter}
        updateFilter={updateFilter}
        clearFilters={clearFilters}
      />

      {appliedFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {appliedFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => removeFilter(filter.key)}
              aria-label={`Remove ${filter.label} filter`}
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-200"
            >
              <span>{filter.label}</span>
              <span aria-hidden="true">x</span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <ClaimsTable claims={claims} loading={loading} />
    </div>
  );
}
