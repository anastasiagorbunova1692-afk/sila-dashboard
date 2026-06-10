'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface RaceSeriesItem {
  key: string
  values: number[]
  color: string
}

interface Props {
  months: string[]
  series: RaceSeriesItem[]
}

export function RacesStackedBar({ months, series }: Props) {
  const data = months.map((m, i) => {
    const row: Record<string, string | number> = { month: m }
    for (const s of series) {
      row[s.key] = s.values[i] ?? 0
    }
    return row
  })

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} width={40} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} stackId="a" fill={s.color} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
