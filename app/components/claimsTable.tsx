import { Claim, ClaimStatus } from "@/lib/types";
import { formatCurrency, formatDate, formatLabel } from "@/lib/formatters";

function getStatusBadgeClass(status: ClaimStatus) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "denied":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function ClaimsTable({
  claims,
  loading,
}: {
  claims: Claim[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <p className="text-sm text-slate-500">
        Loading claims...
      </p>
    );
  }

  if (claims.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No claims match the selected filters.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-[1000px] w-full text-sm text-slate-900">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="p-3 text-left">Claim ID</th>
            <th className="p-3 text-left">Provider</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Review</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Network</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Service Date</th>
            <th className="p-3 text-left">Plan</th>
          </tr>
        </thead>

        <tbody>
          {claims.map((claim) => (
            <tr
              key={claim.claimId}
              className={`border-t border-slate-200 ${claim.flaggedForReview ? "bg-yellow-50" : ""}`}
            >
              <td className="p-3">{claim.claimId}</td>
              <td className="p-3">{claim.providerName}</td>
              <td className="p-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadgeClass(
                    claim.status
                  )}`}
                >
                  {claim.status}
                </span>
              </td>
              <td className="p-3">
                {claim.flaggedForReview ? (
                  <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    Flagged
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-3">{formatLabel(claim.claimType)}</td>
              <td className="p-3">{formatLabel(claim.networkStatus)}</td>
              <td className="p-3">{formatCurrency(claim.amountCents)}</td>
              <td className="p-3">{formatDate(claim.serviceDate)}</td>
              <td className="p-3">{claim.planName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
