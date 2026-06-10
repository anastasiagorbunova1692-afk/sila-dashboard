'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  months: string[]
  revenue: number[]
  ebitda: number[]
}

function fmtM(v: unknown) {
  const n = Number(v)
  if (isNaN(n)) return '—'
  return (n / 1_000_000).toFixed(1) + ' М'
}

export function FinanceLineChart({ months, revenue, ebitda }: Props) {
  const data = months.map((m, i) => ({
    month: m,
    Выручка: revenue[i] ?? 0,
    EBITDA: ebitda[i] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis tickFormatter={fmtM} tick={{ fill: '#9ca3af', fontSize: 11 }} width={56} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: unknown) => [fmtM(value), undefined]}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
        <Line type="monotone" dataKey="Выручка" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="EBITDA" stroke="#22c55e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
