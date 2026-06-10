'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DashboardRow } from '@/lib/sheets'

interface Props {
  data: DashboardRow[]
}

const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

// "2026-06-01" → "1 июн"
function formatDateLabel(iso: string): string {
  const parts = iso.split('-')
  if (parts.length !== 3) return iso
  const day = String(Number(parts[2]))
  const month = MONTHS_SHORT[Number(parts[1]) - 1] ?? ''
  return `${day} ${month}`
}

function formatShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'М'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'К'
  return String(n)
}

export function RevenueChart({ data }: Props) {
  const chartData = data.map(r => ({
    label: formatDateLabel(r.date),
    value: r.totalRevenue,
  }))

  return (
    <div className="rounded-2xl p-5 h-64" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-sm text-gray-400 mb-4">Выручка по дням</p>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatShort} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
            formatter={(v) => [Number(v).toLocaleString('ru-RU') + ' ₽', 'Выручка']}
          />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
