import { MTDRow } from '@/lib/sheets'
import { formatRubles, formatDelta } from '@/lib/utils'

const MONTHS_GENITIVE = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

interface Props {
  data: MTDRow[]
  currentMonth: string
  currentDay: number
  currentMonthIndex: number
}

export function MTDTable({ data, currentMonth, currentDay, currentMonthIndex }: Props) {
  const dateLabel = `${currentDay} ${MONTHS_GENITIVE[currentMonthIndex] ?? ''}`
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <h3 className="font-semibold text-white">MTD отчёт на {dateLabel}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wide">
              <th className="text-left px-5 py-3">Месяц</th>
              <th className="text-right px-4 py-3">Выручка</th>
              <th className="text-right px-4 py-3">△%</th>
              <th className="text-right px-4 py-3">Заездов</th>
              <th className="text-right px-4 py-3">△%</th>
              <th className="text-right px-5 py-3">Клиентов</th>
              <th className="text-right px-5 py-3">△%</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const prev = data[i - 1]
              const revDelta = prev ? formatDelta(row.totalRevenue, prev.totalRevenue) : null
              const racesDelta = prev ? formatDelta(row.races, prev.races) : null
              const clientsDelta = prev ? formatDelta(row.clients, prev.clients) : null
              const isCurrent = row.month === currentMonth

              return (
                <tr
                  key={i}
                  className={`border-t ${isCurrent ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}`}
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <td className="px-5 py-3 font-medium">
                    <span className={isCurrent ? 'text-blue-400' : 'text-white'}>{row.month}</span>
                    {isCurrent && <span className="ml-2 text-xs text-blue-400 font-normal">текущий</span>}
                  </td>
                  <td className="text-right px-4 py-3 text-white font-mono">{formatRubles(row.totalRevenue)}</td>
                  <td className="text-right px-4 py-3">
                    <DeltaCell delta={revDelta} />
                  </td>
                  <td className="text-right px-4 py-3 text-white">{row.races.toLocaleString('ru-RU')}</td>
                  <td className="text-right px-4 py-3">
                    <DeltaCell delta={racesDelta} />
                  </td>
                  <td className="text-right px-5 py-3 text-white">{row.clients.toLocaleString('ru-RU')}</td>
                  <td className="text-right px-5 py-3">
                    <DeltaCell delta={clientsDelta} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DeltaCell({ delta }: { delta: { pct: string; up: boolean | null } | null }) {
  if (!delta || delta.pct === '—') return <span className="text-gray-600">—</span>
  return (
    <span className={`font-medium ${delta.up ? 'text-green-400' : 'text-red-400'}`}>
      {delta.up ? '▲' : '▼'} {delta.pct}
    </span>
  )
}
