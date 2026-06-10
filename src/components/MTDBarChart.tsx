'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { MTDRow } from '@/lib/sheets'

interface Props {
  data: MTDRow[]
  currentMonth: string
}

function formatShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'М'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'К'
  return String(n)
}

export function MTDBarChart({ data, currentMonth }: Props) {
  return (
    <div className="rounded-2xl p-5 h-64" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-sm text-gray-400 mb-4">Выручка по месяцам</p>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatShort} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
            formatter={(v) => [Number(v).toLocaleString('ru-RU') + ' ₽', 'Выручка']}
          />
          <Bar dataKey="totalRevenue" radius={[6, 6, 0, 0]}>
            {data.map((row, i) => (
              <Cell key={i} fill={row.month === currentMonth ? '#3b82f6' : 'rgba(59,130,246,0.35)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
