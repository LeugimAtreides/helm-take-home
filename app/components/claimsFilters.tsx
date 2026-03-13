import { Filters } from "@/lib/types";
import { formatLabel } from "@/lib/formatters";
import { useState } from "react";

const filterDefinitions: { key: keyof Filters; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "providerName", label: "Provider Name" },
  { key: "claimType", label: "Claim Type" },
  { key: "networkStatus", label: "Network Status" },
  { key: "planName", label: "Plan Name" },
  { key: "serviceFrom", label: "Service Date From" },
  { key: "serviceTo", label: "Service Date To" },
  { key: "flagged", label: "Flagged" },
];

export default function ClaimsFilters({
  filters,
  selectedFilters,
  addFilter,
  removeFilter,
  updateFilter,
  clearFilters,
}: {
  filters: Filters;
  selectedFilters: (keyof Filters)[];
  addFilter: (key: keyof Filters) => void;
  removeFilter: (key: keyof Filters) => void;
  updateFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  clearFilters: () => void;
}) {
  const inputClassName =
    "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";

  const [nextFilterKey, setNextFilterKey] = useState<keyof Filters>("status");

  const availableFilterDefinitions = filterDefinitions.filter(
    (definition) => !selectedFilters.includes(definition.key)
  );

  function handleAddFilter() {
    if (!availableFilterDefinitions.some(({ key }) => key === nextFilterKey)) {
      return;
    }

    addFilter(nextFilterKey);

    const nextAvailable = availableFilterDefinitions.find(
      ({ key }) => key !== nextFilterKey
    );
    if (nextAvailable) {
      setNextFilterKey(nextAvailable.key);
    }
  }

  function renderFilterControl(key: keyof Filters) {
    switch (key) {
      case "status":
        return (
          <div className="relative w-full">
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className={`${inputClassName} appearance-none pr-10`}
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="denied">Denied</option>
            </select>
            <Chevron />
          </div>
        );
      case "providerName":
        return (
          <input
            type="text"
            placeholder="Provider name contains..."
            value={filters.providerName}
            onChange={(e) => updateFilter("providerName", e.target.value)}
            className={inputClassName}
          />
        );
      case "claimType":
        return (
          <div className="relative w-full">
            <select
              value={filters.claimType}
              onChange={(e) => updateFilter("claimType", e.target.value)}
              className={`${inputClassName} appearance-none pr-10`}
            >
              <option value="">All Types</option>
              <option value="diagnostic_test">{formatLabel("diagnostic_test")}</option>
              <option value="emergency_visit">{formatLabel("emergency_visit")}</option>
              <option value="hospital_visit">{formatLabel("hospital_visit")}</option>
              <option value="imaging">{formatLabel("imaging")}</option>
              <option value="physical_therapy">{formatLabel("physical_therapy")}</option>
              <option value="prescription">{formatLabel("prescription")}</option>
              <option value="specialist_visit">{formatLabel("specialist_visit")}</option>
              <option value="surgery">{formatLabel("surgery")}</option>
              <option value="urgent_care_visit">{formatLabel("urgent_care_visit")}</option>
            </select>
            <Chevron />
          </div>
        );
      case "networkStatus":
        return (
          <div className="relative w-full">
            <select
              value={filters.networkStatus}
              onChange={(e) => updateFilter("networkStatus", e.target.value)}
              className={`${inputClassName} appearance-none pr-10`}
            >
              <option value="">All Networks</option>
              <option value="in_network">{formatLabel("in_network")}</option>
              <option value="out_of_network">{formatLabel("out_of_network")}</option>
            </select>
            <Chevron />
          </div>
        );
      case "planName":
        return (
          <div className="relative w-full">
            <select
              value={filters.planName}
              onChange={(e) => updateFilter("planName", e.target.value)}
              className={`${inputClassName} appearance-none pr-10`}
            >
              <option value="">All Plans</option>
              <option value="Bronze Saver">Bronze Saver</option>
              <option value="Gold Advantage">Gold Advantage</option>
              <option value="Silver Plus">Silver Plus</option>
            </select>
            <Chevron />
          </div>
        );
      case "serviceFrom":
        return (
          <input
            type="date"
            value={filters.serviceFrom}
            onChange={(e) => updateFilter("serviceFrom", e.target.value)}
            className={inputClassName}
          />
        );
      case "serviceTo":
        return (
          <input
            type="date"
            value={filters.serviceTo}
            onChange={(e) => updateFilter("serviceTo", e.target.value)}
            className={inputClassName}
          />
        );
      case "flagged":
        return (
          <div className="relative w-full">
            <select
              value={filters.flagged}
              onChange={(e) =>
                updateFilter("flagged", e.target.value as Filters["flagged"])
              }
              className={`${inputClassName} appearance-none pr-10`}
            >
              <option value="">Any</option>
              <option value="true">Flagged Only</option>
              <option value="false">Not Flagged</option>
            </select>
            <Chevron />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-slate-900">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-64">
          <select
            value={nextFilterKey}
            onChange={(e) => setNextFilterKey(e.target.value as keyof Filters)}
            className={`${inputClassName} appearance-none pr-10`}
          >
            {availableFilterDefinitions.map((definition) => (
              <option key={definition.key} value={definition.key}>
                {definition.label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>
        <button
          onClick={handleAddFilter}
          disabled={availableFilterDefinitions.length === 0}
          className="rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add Filter
        </button>
        <button
          onClick={clearFilters}
          className="text-left text-sm font-medium text-blue-700 hover:text-blue-800 sm:ml-auto"
        >
          Clear All
        </button>
      </div>

      {selectedFilters.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">
          No filters applied. Add a filter to start narrowing results.
        </div>
      ) : (
        <div className="space-y-2">
          {selectedFilters.map((key) => {
            const definition = filterDefinitions.find(
              (filterDefinition) => filterDefinition.key === key
            );
            if (!definition) return null;

            return (
              <div
                key={key}
                className="flex flex-col gap-2 rounded-md border border-slate-200 p-3 sm:flex-row sm:items-center"
              >
                <div className="w-full text-sm font-medium text-slate-700 sm:w-44">
                  {definition.label}
                </div>
                <div className="w-full flex-1">{renderFilterControl(key)}</div>
                <button
                  onClick={() => removeFilter(key)}
                  className="self-start text-sm font-medium text-slate-500 hover:text-slate-700 sm:self-center"
                  aria-label={`Remove ${definition.label} filter`}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chevron() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
