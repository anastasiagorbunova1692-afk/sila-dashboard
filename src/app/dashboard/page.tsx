import { getDashboardData } from '@/lib/sheets'
import { formatRubles } from '@/lib/utils'
import { StatCard } from '@/components/StatCard'
import { RevenueChart } from '@/components/RevenueChart'
import { MonthsTable, groupByMonth } from '@/components/MonthsTable'

export default async function DashboardPage() {
  const allData = await getDashboardData()

  const now = new Date()
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  // БЛОК 1 — только текущий месяц
  const monthRows = allData.filter(r => r.date.startsWith(currentMonthStr))

  const totals = monthRows.reduce(
    (acc, r) => ({
      totalRevenue: acc.totalRevenue + r.totalRevenue,
      raceRevenue:  acc.raceRevenue  + r.raceRevenue,
      certRevenue:  acc.certRevenue  + r.certRevenue,
      eventRevenue: acc.eventRevenue + r.eventRevenue,
      races:        acc.races        + r.races,
      clients:      acc.clients      + r.clients,
      newClients:   acc.newClients   + r.newClients,
    }),
    { totalRevenue: 0, raceRevenue: 0, certRevenue: 0, eventRevenue: 0, races: 0, clients: 0, newClients: 0 }
  )

  // БЛОК 2 — все месяцы сгруппированные
  const monthGroups = groupByMonth(allData)

  return (
    <div className="space-y-8">

      {/* ── БЛОК 1: Текущий месяц ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Текущий месяц</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1">
            <StatCard label="Выручка общая" value={formatRubles(totals.totalRevenue)} accent />
          </div>
          <StatCard label="Выручка заезды"       value={formatRubles(totals.raceRevenue)} />
          <StatCard label="Выручка сертификаты"  value={formatRubles(totals.certRevenue)} />
          <StatCard label="Выручка мероприятия"  value={formatRubles(totals.eventRevenue)} />
          <StatCard label="Заездов всего"        value={totals.races.toLocaleString('ru-RU')} />
          <StatCard
            label="Клиенты"
            value={totals.clients.toLocaleString('ru-RU')}
            subLabel="новых"
            subValue={totals.newClients.toLocaleString('ru-RU')}
          />
        </div>

        {monthRows.length > 0 && <RevenueChart data={monthRows} />}
      </section>

      {/* ── БЛОК 2: Сравнение по месяцам ── */}
      {monthGroups.length > 0 && (
        <section>
          <MonthsTable groups={monthGroups} currentKey={currentMonthStr} />
        </section>
      )}

    </div>
  )
}
