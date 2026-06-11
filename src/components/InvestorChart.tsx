'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartRow {
  month: string
  totalRevenue: number
}

function formatShort(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'М'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'К'
  return String(n)
}

export function InvestorChart({ data }: { data: ChartRow[] }) {
  return (
    <div className="rounded-2xl p-5 h-72" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatShort} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
            formatter={(v) => [Number(v).toLocaleString('ru-RU') + ' ₽', 'Выручка']}
          />
          <Area type="monotone" dataKey="totalRevenue" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGrad)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
