'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Props {
  title: string
  items: { label: string; value: number }[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4']

export function LeadsPieChart({ title, items }: Props) {
  const data = items.filter((it) => it.value > 0).map((it) => ({ name: it.label, value: it.value }))

  return (
    <div>
      <p className="text-sm text-gray-400 mb-2 text-center">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name} ${(Number(percent) * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
            formatter={(value: unknown) => [Number(value), undefined]}
          />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
