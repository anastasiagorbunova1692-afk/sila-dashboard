import { DashboardRow } from '@/lib/sheets'
import { formatRubles } from '@/lib/utils'

interface MonthGroup {
  key: string   // "YYYY-MM"
  label: string // "Июнь 2026"
  totalRevenue: number
  raceRevenue: number
  certRevenue: number
  eventRevenue: number
  races: number
  clients: number
  newClients: number
}

const MONTHS_RU = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
]

export function groupByMonth(rows: DashboardRow[]): MonthGroup[] {
  const map: Record<string, MonthGroup> = {}
  for (const r of rows) {
    const key = r.date.slice(0, 7) // "YYYY-MM"
    if (!key || key.length < 7) continue
    if (!map[key]) {
      const [y, m] = key.split('-')
      map[key] = {
        key, label: `${MONTHS_RU[Number(m) - 1]} ${y}`,
        totalRevenue: 0, raceRevenue: 0, certRevenue: 0,
        eventRevenue: 0, races: 0, clients: 0, newClients: 0,
      }
    }
    const g = map[key]
    g.totalRevenue += r.totalRevenue
    g.raceRevenue  += r.raceRevenue
    g.certRevenue  += r.certRevenue
    g.eventRevenue += r.eventRevenue
    g.races        += r.races
    g.clients      += r.clients
    g.newClients   += r.newClients
  }
  // Sort oldest → newest
  return Object.values(map).sort((a, b) => a.key.localeCompare(b.key))
}

interface Props {
  groups: MonthGroup[]
  currentKey: string  // "YYYY-MM" of current month
}

function delta(cur: number, prev: number) {
  if (prev === 0) return null
  const p = ((cur - prev) / prev) * 100
  return { up: p >= 0, pct: Math.abs(p).toFixed(0) + '%' }
}

export function MonthsTable({ groups, currentKey }: Props) {
  // Display newest first
  const rows = [...groups].reverse()
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <h3 className="font-semibold text-white">Сравнение по месяцам</h3>
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: '19rem', overflowY: 'auto' }}>
        <table className="w-full text-sm min-w-[600px]">
          <thead className="sticky top-0 z-10" style={{ background: '#111' }}>
            <tr className="text-xs uppercase tracking-wide text-gray-400"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
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
            {rows.map((row, i) => {
              // prev in display order = next in reversed array = older month
              const prev = rows[i + 1]
              const revD = prev ? delta(row.totalRevenue, prev.totalRevenue) : null
              const racD = prev ? delta(row.races, prev.races) : null
              const cliD = prev ? delta(row.clients, prev.clients) : null
              const isCur = row.key === currentKey
              return (
                <tr key={row.key}
                  className={isCur ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-5 py-3 font-medium">
                    <span className={isCur ? 'text-blue-400' : 'text-white'}>{row.label}</span>
                    {isCur && <span className="ml-2 text-xs text-blue-400 font-normal">текущий</span>}
                  </td>
                  <td className="text-right px-4 py-3 text-white font-mono">{formatRubles(row.totalRevenue)}</td>
                  <td className="text-right px-4 py-3"><DeltaCell d={revD} /></td>
                  <td className="text-right px-4 py-3 text-white">{row.races.toLocaleString('ru-RU')}</td>
                  <td className="text-right px-4 py-3"><DeltaCell d={racD} /></td>
                  <td className="text-right px-5 py-3 text-white">{row.clients.toLocaleString('ru-RU')}</td>
                  <td className="text-right px-5 py-3"><DeltaCell d={cliD} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DeltaCell({ d }: { d: { up: boolean; pct: string } | null }) {
  if (!d) return <span className="text-gray-600">—</span>
  return (
    <span className={`font-medium text-xs ${d.up ? 'text-green-400' : 'text-red-400'}`}>
      {d.up ? '▲' : '▼'} {d.pct}
    </span>
  )
}
