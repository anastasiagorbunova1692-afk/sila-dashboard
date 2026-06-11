import { getDashboardData } from '@/lib/sheets'
import { formatRubles } from '@/lib/utils'
import { LogoutButton } from '@/components/LogoutButton'
import { AutoRefresh } from '@/components/AutoRefresh'
import { InvestorChart } from '@/components/InvestorChart'
import { groupByMonth } from '@/components/MonthsTable'

const MONTHS_RU = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']

export default async function InvestorPage() {
  const allData = await getDashboardData()

  const now = new Date()
  const monthName = MONTHS_RU[now.getMonth()]
  const year = now.getFullYear()
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const monthRows = allData.filter(r => r.date.startsWith(currentMonthStr))
  const totals = monthRows.reduce(
    (acc, r) => ({
      totalRevenue: acc.totalRevenue + r.totalRevenue,
      clients: acc.clients + r.clients,
      newClients: acc.newClients + r.newClients,
    }),
    { totalRevenue: 0, clients: 0, newClients: 0 }
  )

  // Growth vs previous month (from grouped data)
  const groups = groupByMonth(allData)
  const curIdx = groups.findIndex(g => g.key === currentMonthStr)
  const prevGroup = curIdx > 0 ? groups[curIdx - 1] : null
  const revGrowth = prevGroup && prevGroup.totalRevenue > 0
    ? (((totals.totalRevenue - prevGroup.totalRevenue) / prevGroup.totalRevenue) * 100).toFixed(1)
    : null

  // Chart data: month groups as MTD-like shape
  const chartData = groups.map(g => ({ month: g.label, totalRevenue: g.totalRevenue }))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AutoRefresh intervalMs={300_000} />

      <header className="px-4 md:px-8 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-white">SILA Картинг</span>
            </div>
            <p className="text-sm text-gray-400">Отчёт для инвесторов</p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-12">

        <section className="text-center space-y-2">
          <p className="text-gray-400 text-sm uppercase tracking-widest">{monthName} {year}</p>
          <p className="text-6xl md:text-7xl font-bold text-white">{formatRubles(totals.totalRevenue)}</p>
          {revGrowth && (
            <p className={`text-xl font-medium ${parseFloat(revGrowth) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(revGrowth) >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(revGrowth))}% к прошлому месяцу
            </p>
          )}
        </section>

        <section className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-3xl font-bold text-white">{totals.clients.toLocaleString('ru-RU')}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Клиентов</p>
          </div>
          <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <p className="text-3xl font-bold text-blue-400">{totals.newClients.toLocaleString('ru-RU')}</p>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Новых</p>
          </div>
        </section>

        {chartData.length > 0 && (
          <section>
            <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-4 text-center">Динамика выручки по месяцам</h3>
            <InvestorChart data={chartData} />
          </section>
        )}
      </main>
    </div>
  )
}
