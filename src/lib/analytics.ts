export interface AnalyticsData {
  months: string[]
  rows: AnalyticsRow[]
  byLabel: Record<string, number[]>
}

export interface AnalyticsRow {
  label: string
  values: number[]
}

function num(v: unknown): number {
  if (v === null || v === undefined) return 0
  const n = Number(v)
  return isNaN(n) ? 0 : n
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const url =
    'https://docs.google.com/spreadsheets/d/1bRMnBP6B4c7mctDdya9EDxYVVonebgf5vjQvLLGO3Kc/gviz/tq?tqx=out:json&sheet=Analytics'
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    const text = await res.text()
    const jsonStr = text.replace(/^[^{]*/, '').replace(/\);?\s*$/, '')
    const data = JSON.parse(jsonStr)
    const table = data?.table
    if (!table) return { months: [], rows: [], byLabel: {} }

    // cols[0] = metric label, cols[1..] = month headers
    const cols: { label?: string }[] = table.cols ?? []
    const months = cols.slice(1).map((c) => c.label ?? '').filter(Boolean)

    const rawRows: { c: { v: unknown }[] }[] = table.rows ?? []
    const rows: AnalyticsRow[] = []
    const byLabel: Record<string, number[]> = {}

    for (const row of rawRows) {
      const cells = row.c ?? []
      const label = String(cells[0]?.v ?? '').trim()
      if (!label) continue
      const values = cells.slice(1).map((c) => num(c?.v))
      rows.push({ label, values })
      byLabel[label] = values
    }

    return { months, rows, byLabel }
  } catch {
    return { months: [], rows: [], byLabel: {} }
  }
}

export function getRow(data: AnalyticsData, labelFragment: string): number[] {
  const key = Object.keys(data.byLabel).find((k) =>
    k.toLowerCase().includes(labelFragment.toLowerCase())
  )
  return key ? data.byLabel[key] : new Array(data.months.length).fill(0)
}
