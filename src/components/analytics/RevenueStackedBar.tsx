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

interface Props {
  months: string[]
  races: number[]
  events: number[]
  certs: number[]
  subs: number[]
  other: number[]
}

function fmtM(v: unknown) {
  const n = Number(v)
  if (isNaN(n)) return '—'
  return (n / 1_000_000).toFixed(1) + ' М'
}

export function RevenueStackedBar({ months, races, events, certs, subs, other }: Props) {
  const data = months.map((m, i) => ({
    month: m,
    Заезды: races[i] ?? 0,
    Мероприятия: events[i] ?? 0,
    Сертификаты: certs[i] ?? 0,
    Абонементы: subs[i] ?? 0,
    Прочее: other[i] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
        <YAxis tickFormatter={fmtM} tick={{ fill: '#9ca3af', fontSize: 11 }} width={56} />
        <Tooltip
          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
          formatter={(value: unknown) => [fmtM(value), undefined]}
        />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
        <Bar dataKey="Заезды" stackId="a" fill="#3b82f6" />
        <Bar dataKey="Мероприятия" stackId="a" fill="#8b5cf6" />
        <Bar dataKey="Сертификаты" stackId="a" fill="#22c55e" />
        <Bar dataKey="Абонементы" stackId="a" fill="#f59e0b" />
        <Bar dataKey="Прочее" stackId="a" fill="#6b7280" />
      </BarChart>
    </ResponsiveContainer>
  )
}
