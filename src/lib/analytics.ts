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
    'https://docs.google.com/spreadsheets/d/1k_7QA2zi2o-YZ3EjNO8bm28uM2BPIBi8-8iM1X3IK2g/gviz/tq?tqx=out:json&sheet=%D0%9E%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BA%D0%B0&pub=1'
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    const text = await res.text()
    const jsonStr = text
      .replace(/^[^{]*/, '')
      .replace(/\);\s*$/, '')
    const data = JSON.parse(jsonStr)
    const table = data?.table
    if (!table) return { months: [], rows: [], byLabel: {} }

    // cols[0] = label column, cols[1..] = month headers
    const cols: { label?: string }[] = table.cols ?? []
    const months: string[] = cols.slice(1).map((c) => c.label ?? '')

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
