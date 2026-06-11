export interface DashboardRow {
  date: string        // ISO "YYYY-MM-DD"
  totalRevenue: number
  raceRevenue: number
  certRevenue: number
  eventRevenue: number
  subsRevenue: number
  races: number
  clients: number
  newClients: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchSheet(sheet: string): Promise<any[]> {
  const url = `https://docs.google.com/spreadsheets/d/1bRMnBP6B4c7mctDdya9EDxYVVonebgf5vjQvLLGO3Kc/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}`
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    const text = await res.text()
    const jsonStr = text.replace(/^[^{]*/, '').replace(/\);?\s*$/, '')
    const data = JSON.parse(jsonStr)
    return data?.table?.rows ?? []
  } catch {
    return []
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function num(v: any): number {
  if (v === null || v === undefined) return 0
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

// gviz date cells arrive as "Date(2026,5,1)" — month is 0-indexed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const rows = await fetchSheet('Dashboard')
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
