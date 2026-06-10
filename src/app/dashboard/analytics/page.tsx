import { getAnalyticsSheet, analyticsRow } from '@/lib/sheets'
import { formatRubles } from '@/lib/utils'
import { AnalyticsLineChart } from '@/components/analytics/AnalyticsLineChart'

function fmt(v: number) { return v !== 0 ? formatRubles(v) : '—' }

function pct(rev: number, ebt: number) {
  if (rev <= 0) return '—'
  return ((ebt / rev) * 100).toFixed(1) + '%'
}

function Card({ label, value, color }: { label: string; value: string; color?: 'blue' | 'green' | 'red' }) {
  const bg = color === 'blue'  ? 'rgba(59,130,246,0.1)'  :
             color === 'green' ? 'rgba(34,197,94,0.1)'   :
             color === 'red'   ? 'rgba(239,68,68,0.1)'   : 'rgba(255,255,255,0.04)'
  const border = color === 'blue'  ? 'rgba(59,130,246,0.3)'  :
                 color === 'green' ? 'rgba(34,197,94,0.3)'   :
                 color === 'red'   ? 'rgba(239,68,68,0.3)'   : 'rgba(255,255,255,0.08)'
  const text = color === 'blue' ? 'text-blue-400' :
               color === 'green' ? 'text-green-400' :
               color === 'red'   ? 'text-red-400'   : 'text-white'
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1" style={{ background: bg, border: `1px solid ${border}` }}>
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-bold ${text}`}>{value}</span>
    </div>
  )
}

export default async function AnalyticsPage() {
  const sheet = await getAnalyticsSheet()
  const { months } = sheet

  const revenue  = analyticsRow(sheet, 'Выручка')
  const expenses = analyticsRow(sheet, 'Расходы')
  const ebitda   = analyticsRow(sheet, 'EBITDA')
  const balance  = analyticsRow(sheet, 'Остаток')

  const last = months.length - 1
  const ebitdaLast = ebitda[last] ?? 0
  const ebitdaColor = ebitdaLast > 0 ? 'green' : ebitdaLast < 0 ? 'red' : undefined

  if (months.length === 0) {
    return (
      <div className="rounded-2xl p-10 text-center text-gray-500"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        Нет данных. Убедитесь что лист Analytics доступен публично.
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* Карточки */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Выручка"           value={fmt(revenue[last] ?? 0)}  color="blue" />
        <Card label="EBITDA"            value={fmt(ebitdaLast)}           color={ebitdaColor} />
        <Card label="Расходы общие"     value={fmt(expenses[last] ?? 0)} />
        <Card label="Остаток на счетах" value={fmt(balance[last] ?? 0)} />
      </div>

      {/* LineChart */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm text-gray-400 mb-4">Выручка и EBITDA по месяцам</p>
        <AnalyticsLineChart months={months} revenue={revenue} ebitda={ebitda} />
      </div>

      {/* Таблица */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-gray-400"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <th className="text-left px-5 py-3">Месяц</th>
                <th className="text-right px-4 py-3">Выручка</th>
                <th className="text-right px-4 py-3">Расходы</th>
                <th className="text-right px-4 py-3">EBITDA</th>
                <th className="text-right px-5 py-3">Маржа</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m, i) => {
                const isCur = i === last
                const ebt = ebitda[i] ?? 0
                return (
                  <tr key={i} className={isCur ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className={`px-5 py-3 font-medium ${isCur ? 'text-blue-400' : 'text-gray-300'}`}>
                      {m}{isCur && <span className="ml-2 text-xs font-normal">текущий</span>}
                    </td>
                    <td className="text-right px-4 py-3 text-white font-mono">{fmt(revenue[i] ?? 0)}</td>
                    <td className="text-right px-4 py-3 text-white font-mono">{fmt(expenses[i] ?? 0)}</td>
                    <td className={`text-right px-4 py-3 font-mono ${ebt >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(ebt)}</td>
                    <td className="text-right px-5 py-3 text-gray-300">{pct(revenue[i] ?? 0, ebt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
