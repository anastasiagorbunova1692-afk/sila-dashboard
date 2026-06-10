export interface DashboardRow {
  date: string
  totalRevenue: number
  raceRevenue: number
  certRevenue: number
  eventRevenue: number
  subsRevenue: number
  races: number
  clients: number
  newClients: number
}

export interface MTDRow {
  month: string
  days: number
  totalRevenue: number
  raceRevenue: number
  certRevenue: number
  eventRevenue: number
  races: number
  clients: number
  newClients: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchSheet(sheet: string): Promise<{ cols: any[]; rows: any[] }> {
  const url = `https://docs.google.com/spreadsheets/d/1bRMnBP6B4c7mctDdya9EDxYVVonebgf5vjQvLLGO3Kc/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}`
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    const text = await res.text()
    const jsonStr = text.replace(/^[^{]*/, '').replace(/\);?\s*$/, '')
    const data = JSON.parse(jsonStr)
    return { cols: data?.table?.cols ?? [], rows: data?.table?.rows ?? [] }
  } catch {
    return { cols: [], rows: [] }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function num(v: any): number {
  if (v === null || v === undefined) return 0
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

// gviz date cells arrive as "Date(2026,5,1)" — month is 0-indexed
function parseGvizDate(v: any): string {
  if (!v) return ''
  const m = String(v).match(/Date\((\d+),(\d+),(\d+)\)/)
  if (m) {
    const year = m[1]
    const month = String(Number(m[2]) + 1).padStart(2, '0')
    const day = m[3].padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return String(v)
}

export async function getDashboardData(): Promise<DashboardRow[]> {
  const { rows } = await fetchSheet('Dashboard')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows
    .filter((r: any) => r?.c?.[0]?.v)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((r: any) => ({
      date: parseGvizDate(r.c[0]?.v),
      totalRevenue: num(r.c[1]?.v),
      raceRevenue: num(r.c[2]?.v),
      certRevenue: num(r.c[3]?.v),
      eventRevenue: num(r.c[4]?.v),
      subsRevenue: num(r.c[5]?.v),
      races: num(r.c[6]?.v),
      clients: num(r.c[7]?.v),
      newClients: num(r.c[8]?.v),
    }))
}

export async function getMTDData(): Promise<MTDRow[]> {
  const { rows } = await fetchSheet('MTD')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows
    .filter((r: any) => r?.c?.[0]?.v)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((r: any) => ({
      month: String(r.c[0]?.v ?? ''),
      days: num(r.c[1]?.v),
      totalRevenue: num(r.c[2]?.v),
      raceRevenue: num(r.c[3]?.v),
      certRevenue: num(r.c[4]?.v),
      eventRevenue: num(r.c[5]?.v),
      races: num(r.c[6]?.v),
      clients: num(r.c[7]?.v),
      newClients: num(r.c[8]?.v),
    }))
}

// ── Analytics sheet ─────────────────────────────────────────────────────────
// Rows = metrics, Columns = months. cols[0] = label col, cols[1..] = month headers.

export interface AnalyticsSheet {
  months: string[]                        // month header labels
  byLabel: Record<string, number[]>       // metric label → array of values per month
}

export async function getAnalyticsSheet(): Promise<AnalyticsSheet> {
  const { cols, rows } = await fetchSheet('Analytics')
  // cols[0] is the label column header; cols[1..] are month names
  const months = cols.slice(1).map((c: any) => String(c?.label ?? '')).filter(Boolean)

  const byLabel: Record<string, number[]> = {}
  for (const row of rows) {
    const cells = (row as any).c ?? []
    const label = String(cells[0]?.v ?? '').trim()
    if (!label) continue
    const values = cells.slice(1).map((c: any) => num(c?.v))
    byLabel[label] = values
  }

  return { months, byLabel }
}

export function analyticsRow(sheet: AnalyticsSheet, fragment: string): number[] {
  const key = Object.keys(sheet.byLabel).find(k =>
    k.toLowerCase().includes(fragment.toLowerCase())
  )
  return key ? sheet.byLabel[key] : new Array(sheet.months.length).fill(0)
}
