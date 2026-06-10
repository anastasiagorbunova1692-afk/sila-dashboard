interface StatCardProps {
  label: string
  value: string
  subValue?: string
  subLabel?: string
  accent?: boolean
  delta?: { pct: string; up: boolean | null }
}

export function StatCard({ label, value, subValue, subLabel, accent, delta }: StatCardProps) {
  const style = accent
    ? { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }
    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1" style={style}>
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-bold ${accent ? 'text-blue-400' : 'text-white'}`}>{value}</span>
      {subValue && (
        <span className="text-sm text-gray-400">{subLabel && <span className="text-gray-500 mr-1">{subLabel}</span>}{subValue}</span>
      )}
      {delta && delta.pct !== '—' && (
        <span className={`text-xs font-medium ${delta.up ? 'text-green-400' : 'text-red-400'}`}>
          {delta.up ? '▲' : '▼'} {delta.pct}
        </span>
      )}
    </div>
  )
}
