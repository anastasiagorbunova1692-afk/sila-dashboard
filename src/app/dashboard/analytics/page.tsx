import { getAnalyticsData, getRow } from '@/lib/analytics'
import { formatRubles } from '@/lib/utils'
import { FinanceLineChart } from '@/components/analytics/FinanceLineChart'
import { MarginBarChart } from '@/components/analytics/MarginBarChart'
import { RevenueStackedBar } from '@/components/analytics/RevenueStackedBar'
import { ExpenseHorizBar } from '@/components/analytics/ExpenseHorizBar'
import { ExpenseLineChart } from '@/components/analytics/ExpenseLineChart'
import { ClientsLineChart } from '@/components/analytics/ClientsLineChart'
import { RacesStackedBar } from '@/components/analytics/RacesStackedBar'

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(v: number)  { return v !== 0 ? formatRubles(v) : '—' }
function fmtN(v: number) { return v !== 0 ? v.toLocaleString('ru-RU') : '—' }
function fmtP(v: number) { return v !== 0 ? v.toFixed(1) + '%' : '—' }
function margin(rev: number, ebt: number) {
  return rev > 0 ? ((ebt / rev) * 100).toFixed(1) + '%' : '—'
}
function delta(cur: number, prev: number): string {
  if (prev === 0) return ''
  const p = ((cur - prev) / prev) * 100
  return (p >= 0 ? '▲' : '▼') + ' ' + Math.abs(p).toFixed(0) + '%'
}
function deltaClass(cur: number, prev: number) {
  if (prev === 0) return 'text-gray-500'
  return cur >= prev ? 'text-green-400' : 'text-red-400'
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-sm text-gray-400 mb-4">{title}</p>
      {children}
    </div>
  )
}

function SectionTitle({ id, label }: { id: string; label: string }) {
  return (
    <h2 id={id} className="text-xl font-bold text-white pb-3 border-b"
      style={{ borderColor: 'rgba(255,255,255,0.1)', scrollMarginTop: '6rem' }}>
      {label}
    </h2>
  )
}

function BigCard({ label, value, color = 'default' }: {
  label: string; value: string
  color?: 'blue' | 'green' | 'red' | 'default'
}) {
  const styles: Record<string, { bg: string; border: string; text: string }> = {
    blue:    { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)',  text: 'text-blue-400' },
    green:   { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   text: 'text-green-400' },
    red:     { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: 'text-red-400' },
    default: { bg: 'rgba(255,255,255,0.04)',border: 'rgba(255,255,255,0.08)',text: 'text-white' },
  }
  const s = styles[color]
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-1" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-2xl font-bold ${s.text}`}>{value}</span>
    </div>
  )
}

// ── Main table components ─────────────────────────────────────────────────────

function RevenueTable({ months, revenue, races, events, certs, subs, ebitda }: {
  months: string[]; revenue: number[]; races: number[]; events: number[]
  certs: number[]; subs: number[]; ebitda: number[]
}) {
  const last = months.length - 1
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left px-4 py-3">Месяц</th>
              <th className="text-right px-4 py-3">Выручка</th>
              <th className="text-right px-4 py-3">Заезды</th>
              <th className="text-right px-4 py-3">Мероп.</th>
              <th className="text-right px-4 py-3">Серт.</th>
              <th className="text-right px-4 py-3">Абон.</th>
              <th className="text-right px-4 py-3">EBITDA</th>
              <th className="text-right px-4 py-3">Маржа</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m, i) => {
              const isCur = i === last
              return (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  className={isCur ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}>
                  <td className={`px-4 py-2.5 font-medium ${isCur ? 'text-blue-400' : 'text-gray-300'}`}>{m}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">
                    {fmt(revenue[i])}
                    {i > 0 && <span className={`ml-1.5 text-xs ${deltaClass(revenue[i], revenue[i-1])}`}>{delta(revenue[i], revenue[i-1])}</span>}
                  </td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(races[i])}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(events[i])}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(certs[i])}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(subs[i])}</td>
                  <td className={`text-right px-4 py-2.5 font-mono ${ebitda[i] >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(ebitda[i])}</td>
                  <td className="text-right px-4 py-2.5 text-gray-300">{margin(revenue[i], ebitda[i])}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ExpenseTable({ months, expenses, fot, rent, marketing, other }: {
  months: string[]; expenses: number[]; fot: number[]; rent: number[]; marketing: number[]; other: number[]
}) {
  const last = months.length - 1
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left px-4 py-3">Месяц</th>
              <th className="text-right px-4 py-3">Расходы</th>
              <th className="text-right px-4 py-3">ФОТ</th>
              <th className="text-right px-4 py-3">Аренда</th>
              <th className="text-right px-4 py-3">Маркетинг</th>
              <th className="text-right px-4 py-3">Прочее</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m, i) => {
              const isCur = i === last
              return (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  className={isCur ? 'bg-blue-500/10' : 'hover:bg-white/[0.02]'}>
                  <td className={`px-4 py-2.5 font-medium ${isCur ? 'text-blue-400' : 'text-gray-300'}`}>{m}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(expenses[i])}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(fot[i])}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(rent[i])}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(marketing[i])}</td>
                  <td className="text-right px-4 py-2.5 text-white font-mono">{fmt(other[i])}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()
  const { months } = data
  const last = months.length - 1

  // Финансы
  const revenue  = getRow(data, 'Выручка')
  const expenses = getRow(data, 'Расходы общие')
  const ebitda   = getRow(data, 'EBITDA')
  const balance  = getRow(data, 'Остатки на счетах')

  // Выручка по сегментам
  const revRaces  = getRow(data, 'Сумма заездов')
  const revEvents = getRow(data, 'Мероприятия')
  const revCerts  = getRow(data, 'Сертификаты')
  const revSubs   = getRow(data, 'Абонементы')
  const revOther  = months.map((_, i) =>
    Math.max(0, revenue[i] - revRaces[i] - revEvents[i] - revCerts[i] - revSubs[i])
  )

  // Расходы
  const expFOT       = getRow(data, 'ФОТ')
  const expRent      = getRow(data, 'Аренда')
  const expMarketing = getRow(data, 'Маркетинг')
  const expKart      = getRow(data, 'Картодром')
  const expIT        = getRow(data, 'ИТ')
  const expHoz       = getRow(data, 'Хоз')
  const expTax       = getRow(data, 'Налог')
  const expOther     = getRow(data, 'Прочие расходы')

  const expenseItems = [
    { label: 'ФОТ',         value: expFOT[last] },
    { label: 'Аренда',      value: expRent[last] },
    { label: 'Маркетинг',   value: expMarketing[last] },
    { label: 'Картодром',   value: expKart[last] },
    { label: 'ИТ системы',  value: expIT[last] },
    { label: 'Хоз расходы', value: expHoz[last] },
    { label: 'Налоги',      value: expTax[last] },
    { label: 'Прочее',      value: expOther[last] },
  ].filter(i => i.value > 0)

  const expOtherCalc = months.map((_, i) =>
    Math.max(0, expenses[i] - expFOT[i] - expRent[i] - expMarketing[i])
  )

  // Клиенты и заезды
  const clients    = getRow(data, 'Клиентов')
  const newClients = getRow(data, 'Новых клиентов')
  const newCliPct  = getRow(data, 'Доля новых')
  const racesTotal = getRow(data, 'Заездов всего')
  const load       = getRow(data, 'Загрузка')

  const raceTypes = [
    { key: 'Будни базовые',      values: getRow(data, 'Базовые будни'),     color: '#3b82f6' },
    { key: 'Будни повторные',    values: getRow(data, 'Повторные будни'),   color: '#8b5cf6' },
    { key: 'Выходные базовые',   values: getRow(data, 'Базовые выходные'),  color: '#22c55e' },
    { key: 'Выходные повторные', values: getRow(data, 'Повторные выходные'),color: '#f59e0b' },
    { key: 'Акции',              values: getRow(data, 'Акции'),             color: '#ef4444' },
  ]

  const ebitdaLast = ebitda[last] ?? 0
  const ebitdaColor = ebitdaLast > 0 ? 'green' : ebitdaLast < 0 ? 'red' : 'default'

  const noData = months.length === 0

  return (
    <div className="flex gap-8">
      {/* Sticky side nav */}
      <aside className="hidden lg:block w-40 shrink-0">
        <nav className="sticky space-y-1" style={{ top: '5.5rem' }}>
          {[
            { id: 'overview',  label: '📊 Обзор' },
            { id: 'revenue',   label: '💰 Выручка' },
            { id: 'expenses',  label: '📉 Расходы' },
            { id: 'clients',   label: '👥 Клиенты' },
          ].map(({ id, label }) => (
            <a key={id} href={`#${id}`}
              className="block text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 space-y-14">

        {noData && (
          <div className="rounded-2xl p-8 text-center text-gray-500"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            Нет данных. Проверьте доступность таблицы.
          </div>
        )}

        {/* ═══ СЕКЦИЯ 1 — ОБЗОР ═══ */}
        <section className="space-y-5">
          <SectionTitle id="overview" label="Обзор" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <BigCard label="Выручка" value={fmt(revenue[last] ?? 0)} color="blue" />
            <BigCard label="EBITDA"  value={fmt(ebitdaLast)} color={ebitdaColor} />
            <BigCard label="Расходы общие" value={fmt(expenses[last] ?? 0)} />
            <BigCard label="Остаток на счетах" value={fmt(balance[last] ?? 0)} />
          </div>

          {!noData && (
            <>
              <ChartCard title="Выручка и EBITDA по месяцам">
                <FinanceLineChart months={months} revenue={revenue} ebitda={ebitda} />
              </ChartCard>
              <ChartCard title="Маржинальность по месяцам (EBITDA / Выручка)">
                <MarginBarChart months={months} revenue={revenue} ebitda={ebitda} />
              </ChartCard>
            </>
          )}
        </section>

        {/* ═══ СЕКЦИЯ 2 — ВЫРУЧКА ═══ */}
        <section className="space-y-5">
          <SectionTitle id="revenue" label="Выручка" />

          {!noData && (
            <ChartCard title="Структура выручки по месяцам">
              <RevenueStackedBar
                months={months}
                races={revRaces}
                events={revEvents}
                certs={revCerts}
                subs={revSubs}
                other={revOther}
              />
            </ChartCard>
          )}

          <RevenueTable
            months={months}
            revenue={revenue}
            races={revRaces}
            events={revEvents}
            certs={revCerts}
            subs={revSubs}
            ebitda={ebitda}
          />
        </section>

        {/* ═══ СЕКЦИЯ 3 — РАСХОДЫ ═══ */}
        <section className="space-y-5">
          <SectionTitle id="expenses" label="Расходы" />

          {!noData && expenseItems.length > 0 && (
            <ChartCard title={`Структура расходов — ${months[last]}`}>
              <ExpenseHorizBar items={expenseItems} />
            </ChartCard>
          )}

          {!noData && (
            <ChartCard title="Расходы vs Выручка по месяцам">
              <ExpenseLineChart months={months} revenue={revenue} expenses={expenses} />
            </ChartCard>
          )}

          <ExpenseTable
            months={months}
            expenses={expenses}
            fot={expFOT}
            rent={expRent}
            marketing={expMarketing}
            other={expOtherCalc}
          />
        </section>

        {/* ═══ СЕКЦИЯ 4 — КЛИЕНТЫ И ЗАЕЗДЫ ═══ */}
        <section className="space-y-5">
          <SectionTitle id="clients" label="Клиенты и заезды" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <BigCard label="Клиентов"          value={fmtN(clients[last] ?? 0)} />
            <BigCard label="Новых клиентов"    value={fmtN(newClients[last] ?? 0)} color="blue" />
            <BigCard label="Доля новых"         value={fmtP(newCliPct[last] ?? 0)} />
            <BigCard label="Всего заездов"      value={fmtN(racesTotal[last] ?? 0)} />
            <BigCard label="Загрузка"           value={fmtP(load[last] ?? 0)} />
          </div>

          {!noData && (
            <>
              <ChartCard title="Клиенты по месяцам">
                <ClientsLineChart months={months} clients={clients} newClients={newClients} />
              </ChartCard>
              <ChartCard title="Типы заездов по месяцам">
                <RacesStackedBar months={months} series={raceTypes} />
              </ChartCard>
            </>
          )}
        </section>

      </div>
    </div>
  )
}
