'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts'

interface Props {
  months: string[]
  revenue: number[]
  ebitda: number[]
}

export function MarginBarChart({ months, revenue, ebitda }: Props) {
  const data = months.map((m, i) => {
    const rev = revenue[i] ?? 0
    const ebt = ebitda[i] ?? 0
    return { month: m, margin: rev > 0 ? parseFloat(((ebt / rev) * 100).toFixed(1)) : 0 }
  })

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis tickFormatter={(v) => v + '%'} tick={{ fill: '#9ca3af', fontSize: 11 }} width={48} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
          formatter={(v: unknown) => [Number(v).toFixed(1) + '%', 'Маржа']}
        />
        <Bar dataKey="margin" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.margin >= 0 ? '#22c55e' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
