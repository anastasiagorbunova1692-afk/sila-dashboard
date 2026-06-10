'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  months: string[]
  revenue: number[]
  ebitda: number[]
}

function fmtM(v: unknown) {
  const n = Number(v)
  if (isNaN(n)) return '—'
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' М'
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(0) + ' К'
  return String(n)
}

export function AnalyticsLineChart({ months, revenue, ebitda }: Props) {
  const data = months.map((m, i) => ({
    month: m,
    Выручка: revenue[i] ?? 0,
    EBITDA: ebitda[i] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={fmtM} tick={{ fill: '#9ca3af', fontSize: 11 }} width={56} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#fff' }}
          labelStyle={{ color: '#fff', marginBottom: 4 }}
          formatter={(v: unknown) => [fmtM(v), undefined]}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, paddingTop: 8 }} />
        <Line type="monotone" dataKey="Выручка" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="EBITDA"  stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
