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
// Fetched as CSV (published Google Sheet — no CORS issues on server).
// Row 0 = month headers; each subsequent row: col 0 = metric label, col 1..= values.

export interface AnalyticsSheet {
  months: string[]
  byLabel: Record<string, number[]>
}

function parseCSV(text: string): string[][] {
  const result: string[][] = []
  for (const line of text.split('\n')) {
    const row: string[] = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++ } else inQ = !inQ }
      else if (ch === ',' && !inQ) { row.push(cur); cur = '' }
      else cur += ch
    }
    row.push(cur.replace(/\r$/, ''))
    if (row.some(c => c)) result.push(row)
  }
  return result
}

function numCSV(s: string): number {
  const n = parseFloat(s.trim().replace(/\s/g, '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}

export async function getAnalyticsSheet(): Promise<AnalyticsSheet> {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSTopIEBlEjf8o0O7SdzEPGXFwGP83qXqjxERV-P851rJIppmCnGLHfUpzMtxSkKtG2FoNRxYhLzGOJ/pub?output=csv&gid=1413980308'
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return { months: [], byLabel: {} }
    const matrix = parseCSV(await res.text())
    if (matrix.length < 2) return { months: [], byLabel: {} }

    // First row: cell[0] is empty/label header, cells[1..] are month names
    const months = matrix[0].slice(1).map(s => s.trim()).filter(Boolean)
    const byLabel: Record<string, number[]> = {}

    for (const row of matrix.slice(1)) {
      const label = row[0]?.trim()
      if (!label) continue
      byLabel[label] = row.slice(1, 1 + months.length).map(numCSV)
    }

    return { months, byLabel }
  } catch {
    return { months: [], byLabel: {} }
  }
}

export function analyticsRow(sheet: AnalyticsSheet, fragment: string): number[] {
  const key = Object.keys(sheet.byLabel).find(k =>
    k.toLowerCase().includes(fragment.toLowerCase())
  )
  return key ? sheet.byLabel[key] : new Array(sheet.months.length).fill(0)
}
