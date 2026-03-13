import { formatCurrency } from "@/lib/formatters"

export default function MetricCard({
  title,
  value,
  currency = false,
}: {
  title: string
  value: number
  currency?: boolean
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {currency ? formatCurrency(value) : value.toLocaleString()}
      </p>
    </div>
  )
}