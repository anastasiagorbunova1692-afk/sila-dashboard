import { getDashboardData, getMTDData } from '@/lib/sheets'
import { formatRubles } from '@/lib/utils'
import { StatCard } from '@/components/StatCard'
import { RevenueChart } from '@/components/RevenueChart'
import { MTDTable } from '@/components/MTDTable'
import { MTDBarChart } from '@/components/MTDBarChart'
import { LogoutButton } from '@/components/LogoutButton'
import { AutoRefresh } from '@/components/AutoRefresh'

const MONTHS_RU = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

export default async function DashboardPage() {
  const [dashboardData, mtdData] = await Promise.all([getDashboardData(), getMTDData()])

  const now = new Date()
  const currentDay = now.getDate()
  const monthName = MONTHS_RU[now.getMonth()]
  const year = now.getFullYear()
  const updatedAt = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  // Filter Dashboard rows to current month only (dates are ISO "YYYY-MM-DD" after parsing)
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthRows = dashboardData.filter(r => r.date.startsWith(currentMonthStr))

  const totals = monthRows.reduce(
    (acc, r) => ({
      totalRevenue: acc.totalRevenue + r.totalRevenue,
      raceRevenue: acc.raceRevenue + r.raceRevenue,
      certRevenue: acc.certRevenue + r.certRevenue,
      eventRevenue: acc.eventRevenue + r.eventRevenue,
      races: acc.races + r.races,
      clients: acc.clients + r.clients,
      newClients: acc.newClients + r.newClients,
    }),
    { totalRevenue: 0, raceRevenue: 0, certRevenue: 0, eventRevenue: 0, races: 0, clients: 0, newClients: 0 }
  )

  // Get current month name from MTD data
  const currentMTD = mtdData[mtdData.length - 1]
  const currentMTDMonth = currentMTD?.month ?? ''

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AutoRefresh intervalMs={300_000} />

      {/* Header */}
      <header className="sticky top-0 z-10 px-4 md:px-8 py-4" style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">SILA Картинг — {monthName} {year}</h1>
              <div className="flex items-center gap-1.5">
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                <span className="text-xs text-green-400">Live</span>
                <span className="text-xs text-gray-600 ml-1">· обновлено {updatedAt}</span>
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* BLOCK 1 — Current month */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Текущий месяц</h2>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="col-span-2 md:col-span-1">
              <StatCard label="Выручка общая" value={formatRubles(totals.totalRevenue)} accent />
            </div>
            <StatCard label="Выручка заезды" value={formatRubles(totals.raceRevenue)} />
            <StatCard label="Выручка сертификаты" value={formatRubles(totals.certRevenue)} />
            <StatCard label="Выручка мероприятия" value={formatRubles(totals.eventRevenue)} />
            <StatCard label="Заездов всего" value={totals.races.toLocaleString('ru-RU')} />
            <StatCard
              label="Клиенты"
              value={totals.clients.toLocaleString('ru-RU')}
              subLabel="новых"
              subValue={totals.newClients.toLocaleString('ru-RU')}
            />
          </div>

          {/* Daily revenue chart */}
          {dashboardData.length > 0 && <RevenueChart data={monthRows} />}
        </section>

        {/* BLOCK 2 — MTD comparison */}
        {mtdData.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Сравнение по месяцам</h2>
            <MTDBarChart data={mtdData} currentMonth={currentMTDMonth} />
            <MTDTable data={mtdData} currentMonth={currentMTDMonth} currentDay={currentDay} currentMonthIndex={now.getMonth()} />
          </section>
        )}
      </main>
    </div>
  )
}
