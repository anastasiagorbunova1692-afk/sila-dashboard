'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface Props {
  items: { label: string; value: number }[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#6b7280']

function fmtM(v: unknown) {
  const n = Number(v)
  if (isNaN(n) || n === 0) return '—'
  return (n / 1_000_000).toFixed(2) + ' М'
}

export function ExpenseHorizBar({ items }: Props) {
  const data = items.map((it) => ({ name: it.label, value: it.value }))

  return (
    <ResponsiveContainer width="100%" height={Math.max(200, items.length * 40)}>
      <BarChart layout="vertical" data={data} margin={{ top: 4, right: 80, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis type="number" tickFormatter={fmtM} tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#d1d5db', fontSize: 12 }} width={120} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          formatter={(value: unknown) => [fmtM(value), 'Сумма']}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
