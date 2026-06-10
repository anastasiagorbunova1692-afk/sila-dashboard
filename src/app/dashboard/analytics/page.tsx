import { getAnalyticsData, getRow } from '@/lib/analytics'
import { formatRubles } from '@/lib/utils'
import { StatCard } from '@/components/StatCard'
import { FinanceLineChart } from '@/components/analytics/FinanceLineChart'
import { RevenueStackedBar } from '@/components/analytics/RevenueStackedBar'
import { RacesStackedBar } from '@/components/analytics/RacesStackedBar'
import { ExpenseHorizBar } from '@/components/analytics/ExpenseHorizBar'
import { ClientsLineChart } from '@/components/analytics/ClientsLineChart'
import { LeadsPieChart } from '@/components/analytics/LeadsPieChart'

function fmt(v: number) {
  return v > 0 ? formatRubles(v) : '—'
}
function fmtN(v: number) {
  return v > 0 ? v.toLocaleString('ru-RU') : '—'
}
function fmtP(v: number) {
  return v > 0 ? v.toFixed(1) + '%' : '—'
}

function SectionTitle({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="text-xl font-bold text-white pt-2 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)', scrollMarginTop: '6rem' }}>
      {title}
    </h2>
  )
}

function MonthTable({ months, rows, lastIdx }: {
  months: string[]
  rows: { label: string; values: number[]; isRubles?: boolean; isPct?: boolean }[]
  lastIdx: number
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th className="text-left px-4 py-3 sticky left-0 bg-[#0f0f0f]">Метрика</th>
              {months.map((m, i) => (
                <th key={i} className={`text-right px-4 py-3 ${i === lastIdx ? 'text-blue-400' : ''}`}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/[0.02]">
                <td className="px-4 py-2.5 text-gray-300 sticky left-0 bg-[#0a0a0a]">{row.label}</td>
                {row.values.map((v, i) => (
                  <td key={i} className={`text-right px-4 py-2.5 font-mono ${i === lastIdx ? 'text-blue-300' : 'text-white'}`}>
                    {v === 0 ? '—' : row.isPct ? fmtP(v) : row.isRubles ? formatRubles(v) : v.toLocaleString('ru-RU')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData()
  const { months } = data
  const lastIdx = months.length - 1

  // ── ФИНАНСЫ ──────────────────────────────────────────────────────────
  const revenue     = getRow(data, 'Выручка общая')
  const expenses    = getRow(data, 'Расходы общие')
  const ebitda      = getRow(data, 'EBITDA')
  const balance     = getRow(data, 'Остаток')
  const revRaces    = getRow(data, 'Заезды выручка')
  const revEvents   = getRow(data, 'Мероприятия выручка')
  const revCerts    = getRow(data, 'Сертификаты выручка')
  const revSubs     = getRow(data, 'Абонементы выручка')
  const revOther    = getRow(data, 'Прочая выручка')

  // ── ЗАЕЗДЫ ────────────────────────────────────────────────────────────
  const racesTotal  = getRow(data, 'Заездов всего')
  const racesWE     = getRow(data, 'Заезды выходные')
  const racesWD     = getRow(data, 'Заезды будни')
  const racesPromo  = getRow(data, 'Заезды по акции')
  const racesTA     = getRow(data, 'Заезды ТА')

  const raceTypes = [
    { key: 'Утренние будни',    values: getRow(data, 'Утренние будни'),    color: '#3b82f6' },
    { key: 'Базовые будни',     values: getRow(data, 'Базовые будни'),     color: '#8b5cf6' },
    { key: 'Повторные будни',   values: getRow(data, 'Повторные будни'),   color: '#22c55e' },
    { key: 'Базовые выходные',  values: getRow(data, 'Базовые выходные'),  color: '#f59e0b' },
    { key: 'Повторные выходные',values: getRow(data, 'Повторные выходные'),color: '#ef4444' },
    { key: 'Акции',             values: getRow(data, 'Акции заезды'),      color: '#06b6d4' },
    { key: 'КЛУБ SILA',         values: getRow(data, 'КЛУБ'),              color: '#ec4899' },
    { key: 'ТА',                values: getRow(data, 'ТА'),                color: '#a78bfa' },
  ]

  // ── РАСХОДЫ ───────────────────────────────────────────────────────────
  const expFOT      = getRow(data, 'ФОТ')
  const expRent     = getRow(data, 'Аренда')
  const expMarketing= getRow(data, 'Маркетинг')
  const expKart     = getRow(data, 'Картодром')
  const expIT       = getRow(data, 'ИТ')
  const expHoz      = getRow(data, 'Хоз')
  const expTax      = getRow(data, 'Налог')
  const expOther    = getRow(data, 'Прочие расходы')

  const expenseItems = [
    { label: 'ФОТ',         value: expFOT[lastIdx] },
    { label: 'Аренда',      value: expRent[lastIdx] },
    { label: 'Маркетинг',   value: expMarketing[lastIdx] },
    { label: 'Картодром',   value: expKart[lastIdx] },
    { label: 'ИТ системы',  value: expIT[lastIdx] },
    { label: 'Хоз расходы', value: expHoz[lastIdx] },
    { label: 'Налоги',      value: expTax[lastIdx] },
    { label: 'Прочее',      value: expOther[lastIdx] },
  ].filter(i => i.value > 0)

  const fotMarshal  = getRow(data, 'Маршал')
  const fotAdmin    = getRow(data, 'Администратор')
  const fotMech     = getRow(data, 'Механик')
  const fotMgmt     = getRow(data, 'Управление')
  const fotSales    = getRow(data, 'Отдел продаж')
  const fotBonus    = getRow(data, 'Бонус')
  const fotAcct     = getRow(data, 'Бухгалтер')
  const fotOther    = getRow(data, 'Прочие ФОТ')

  // ── КЛИЕНТЫ И МЕРОПРИЯТИЯ ─────────────────────────────────────────────
  const clients     = getRow(data, 'Клиентов')
  const newClients  = getRow(data, 'Новых клиентов')
  const newCliPct   = getRow(data, 'Доля новых')
  const load        = getRow(data, 'Загрузка')
  const traffic     = getRow(data, 'Входящий трафик')
  const eventsCount = getRow(data, 'Мероприятий')
  const eventsAvg   = getRow(data, 'Средний чек мероприятия')
  const eventsConv  = getRow(data, 'Конверсия мероприятий')
  const eventsLeads = getRow(data, 'Заявок мероприятия')
  const eventsRev   = getRow(data, 'Выручка мероприятия')

  // ── МАРКЕТИНГ ─────────────────────────────────────────────────────────
  const mkDgisCost  = getRow(data, '2ГИС расход')
  const mkDgisLeads = getRow(data, '2ГИС заявки')
  const mkDirCost   = getRow(data, 'Директ расход')
  const mkDirLeads  = getRow(data, 'Директ заявки')
  const mkSocCost   = getRow(data, 'Соцсети расход')
  const mkSocLeads  = getRow(data, 'Соцсети заявки')
  const mkOrgLeads  = getRow(data, 'Органика')
  const mkCallLeads = getRow(data, 'Звонки')
  const certAdmin   = getRow(data, 'Сертификаты администратор')
  const certOnline  = getRow(data, 'Сертификаты онлайн')

  const leadSources = [
    { label: '2ГИС',    value: mkDgisLeads[lastIdx] },
    { label: 'Директ',  value: mkDirLeads[lastIdx] },
    { label: 'Соцсети', value: mkSocLeads[lastIdx] },
    { label: 'Органика',value: mkOrgLeads[lastIdx] },
    { label: 'Звонки',  value: mkCallLeads[lastIdx] },
  ]

  const eventLeadSources = [
    { label: '2ГИС',    value: getRow(data, '2ГИС меропр')[lastIdx] },
    { label: 'Директ',  value: getRow(data, 'Директ меропр')[lastIdx] },
    { label: 'Соцсети', value: getRow(data, 'Соцсети меропр')[lastIdx] },
    { label: 'Органика',value: getRow(data, 'Органика меропр')[lastIdx] },
  ]

  return (
    <div className="flex gap-8">
      {/* Sticky side nav */}
      <aside className="hidden lg:block w-40 shrink-0">
        <nav className="sticky space-y-1" style={{ top: '5.5rem' }}>
          {[
            { id: 'finances',  label: 'Финансы' },
            { id: 'races',     label: 'Заезды' },
            { id: 'expenses',  label: 'Расходы' },
            { id: 'clients',   label: 'Клиенты' },
            { id: 'marketing', label: 'Маркетинг' },
          ].map(({ id, label }) => (
            <a key={id} href={`#${id}`}
              className="block text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-14">

        {/* ═══ СЕКЦИЯ 1 — ФИНАНСЫ ═══ */}
        <section className="space-y-5">
          <SectionTitle id="finances" title="Финансы" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Выручка" value={fmt(revenue[lastIdx])} accent />
            <StatCard label="Расходы общие" value={fmt(expenses[lastIdx])} />
            <StatCard label="EBITDA" value={fmt(ebitda[lastIdx])} />
            <StatCard label="Остаток на счетах" value={fmt(balance[lastIdx])} />
          </div>

          {months.length > 0 && (
            <FinanceLineChart months={months} revenue={revenue} ebitda={ebitda} />
          )}
          {months.length > 0 && (
            <RevenueStackedBar
              months={months}
              races={revRaces}
              events={revEvents}
              certs={revCerts}
              subs={revSubs}
              other={revOther}
            />
          )}

          <MonthTable
            months={months}
            lastIdx={lastIdx}
            rows={[
              { label: 'Выручка',           values: revenue,  isRubles: true },
              { label: 'Расходы',           values: expenses, isRubles: true },
              { label: 'EBITDA',            values: ebitda,   isRubles: true },
              { label: 'Остаток на счетах', values: balance,  isRubles: true },
            ]}
          />
        </section>

        {/* ═══ СЕКЦИЯ 2 — ЗАЕЗДЫ ═══ */}
        <section className="space-y-5">
          <SectionTitle id="races" title="Заезды" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Всего заездов"   value={fmtN(racesTotal[lastIdx])} />
            <StatCard label="Выходные"        value={fmtN(racesWE[lastIdx])} />
            <StatCard label="Будни"           value={fmtN(racesWD[lastIdx])} />
            <StatCard label="По акции"        value={fmtN(racesPromo[lastIdx])} />
            <StatCard label="Заезды ТА"       value={fmtN(racesTA[lastIdx])} />
          </div>

          {months.length > 0 && (
            <RacesStackedBar months={months} series={raceTypes} />
          )}

          <MonthTable
            months={months}
            lastIdx={lastIdx}
            rows={raceTypes.map(rt => ({ label: rt.key, values: rt.values }))}
          />
        </section>

        {/* ═══ СЕКЦИЯ 3 — РАСХОДЫ ═══ */}
        <section className="space-y-5">
          <SectionTitle id="expenses" title="Расходы" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="ФОТ"         value={fmt(expFOT[lastIdx])} />
            <StatCard label="Аренда"      value={fmt(expRent[lastIdx])} />
            <StatCard label="Маркетинг"   value={fmt(expMarketing[lastIdx])} />
            <StatCard label="Картодром"   value={fmt(expKart[lastIdx])} />
            <StatCard label="ИТ системы"  value={fmt(expIT[lastIdx])} />
            <StatCard label="Хоз расходы" value={fmt(expHoz[lastIdx])} />
            <StatCard label="Налоги"      value={fmt(expTax[lastIdx])} />
            <StatCard label="Прочее"      value={fmt(expOther[lastIdx])} />
          </div>

          {expenseItems.length > 0 && (
            <ExpenseHorizBar items={expenseItems} />
          )}

          <p className="text-sm font-semibold text-gray-300 pt-2">Детализация ФОТ</p>
          <MonthTable
            months={months}
            lastIdx={lastIdx}
            rows={[
              { label: 'Маршалы',       values: fotMarshal, isRubles: true },
              { label: 'Администраторы',values: fotAdmin,   isRubles: true },
              { label: 'Механики',      values: fotMech,    isRubles: true },
              { label: 'Управление',    values: fotMgmt,    isRubles: true },
              { label: 'Отдел продаж',  values: fotSales,   isRubles: true },
              { label: 'Бонусы',        values: fotBonus,   isRubles: true },
              { label: 'Бухгалтер',     values: fotAcct,    isRubles: true },
              { label: 'Прочие',        values: fotOther,   isRubles: true },
            ]}
          />

          <p className="text-sm font-semibold text-gray-300 pt-2">Все категории расходов</p>
          <MonthTable
            months={months}
            lastIdx={lastIdx}
            rows={[
              { label: 'ФОТ',         values: expFOT,       isRubles: true },
              { label: 'Аренда',      values: expRent,      isRubles: true },
              { label: 'Маркетинг',   values: expMarketing, isRubles: true },
              { label: 'Картодром',   values: expKart,      isRubles: true },
              { label: 'ИТ системы',  values: expIT,        isRubles: true },
              { label: 'Хоз расходы', values: expHoz,       isRubles: true },
              { label: 'Налоги',      values: expTax,       isRubles: true },
              { label: 'Прочее',      values: expOther,     isRubles: true },
            ]}
          />
        </section>

        {/* ═══ СЕКЦИЯ 4 — КЛИЕНТЫ И МЕРОПРИЯТИЯ ═══ */}
        <section className="space-y-5">
          <SectionTitle id="clients" title="Клиенты и мероприятия" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Клиентов"              value={fmtN(clients[lastIdx])} />
            <StatCard label="Новых клиентов"        value={fmtN(newClients[lastIdx])} />
            <StatCard label="Доля новых"            value={fmtP(newCliPct[lastIdx])} />
            <StatCard label="Загрузка картодрома"   value={fmtP(load[lastIdx])} />
            <StatCard label="Входящий трафик"       value={fmtN(traffic[lastIdx])} />
            <StatCard label="Мероприятий"           value={fmtN(eventsCount[lastIdx])} />
            <StatCard label="Ср. чек мероприятия"   value={fmt(eventsAvg[lastIdx])} />
            <StatCard label="Конверсия меропр."     value={fmtP(eventsConv[lastIdx])} />
          </div>

          {months.length > 0 && (
            <ClientsLineChart months={months} clients={clients} newClients={newClients} />
          )}

          <p className="text-sm font-semibold text-gray-300 pt-2">Мероприятия по месяцам</p>
          <MonthTable
            months={months}
            lastIdx={lastIdx}
            rows={[
              { label: 'Заявок',     values: eventsLeads },
              { label: 'Проведено',  values: eventsCount },
              { label: 'Ср. чек',    values: eventsAvg,  isRubles: true },
              { label: 'Конверсия',  values: eventsConv, isPct: true },
              { label: 'Выручка',    values: eventsRev,  isRubles: true },
            ]}
          />
        </section>

        {/* ═══ СЕКЦИЯ 5 — МАРКЕТИНГ ═══ */}
        <section className="space-y-5">
          <SectionTitle id="marketing" title="Маркетинг" />

          <p className="text-sm font-semibold text-gray-300">Каналы привлечения ({months[lastIdx]})</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-gray-400" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th className="text-left px-4 py-3">Канал</th>
                  <th className="text-right px-4 py-3">Расход</th>
                  <th className="text-right px-4 py-3">Заявок</th>
                  <th className="text-right px-4 py-3">Записей</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '2ГИС',    cost: mkDgisCost[lastIdx], leads: mkDgisLeads[lastIdx], rec: getRow(data, '2ГИС записи')[lastIdx] },
                  { label: 'Директ',  cost: mkDirCost[lastIdx],  leads: mkDirLeads[lastIdx],  rec: getRow(data, 'Директ записи')[lastIdx] },
                  { label: 'Соцсети', cost: mkSocCost[lastIdx],  leads: mkSocLeads[lastIdx],  rec: getRow(data, 'Соцсети записи')[lastIdx] },
                  { label: 'Звонки',  cost: 0,                   leads: mkCallLeads[lastIdx], rec: 0 },
                  { label: 'Органика',cost: 0,                   leads: mkOrgLeads[lastIdx],  rec: getRow(data, 'Органика записи')[lastIdx] },
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-2.5 text-gray-300">{row.label}</td>
                    <td className="text-right px-4 py-2.5 text-white font-mono">{row.cost > 0 ? formatRubles(row.cost) : '—'}</td>
                    <td className="text-right px-4 py-2.5 text-white">{row.leads > 0 ? row.leads : '—'}</td>
                    <td className="text-right px-4 py-2.5 text-white">{row.rec > 0 ? row.rec : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeadsPieChart title="Источники заявок на заезды" items={leadSources} />
            <LeadsPieChart title="Источники заявок на мероприятия" items={eventLeadSources} />
          </div>

          <p className="text-sm font-semibold text-gray-300 pt-2">Сертификаты</p>
          <MonthTable
            months={months}
            lastIdx={lastIdx}
            rows={[
              { label: 'Администраторы', values: certAdmin, isRubles: true },
              { label: 'Онлайн',         values: certOnline, isRubles: true },
            ]}
          />
        </section>

      </div>
    </div>
  )
}
