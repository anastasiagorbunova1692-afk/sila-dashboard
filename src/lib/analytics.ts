export interface AnalyticsData {
  months: string[]
  rows: AnalyticsRow[]
  byLabel: Record<string, number[]>
}

export interface AnalyticsRow {
  label: string
  values: number[]
}

function num(raw: string): number {
  const s = raw.trim().replace(/\s/g, '').replace(',', '.')
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

// Minimal CSV parser — handles quoted fields with commas inside
function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  for (const line of text.split('\n')) {
    const trimmed = line.trimEnd()
    if (!trimmed) continue
    const cells: string[] = []
    let cur = ''
    let inQuote = false
    for (let i = 0; i < trimmed.length; i++) {
      const ch = trimmed[i]
      if (ch === '"') {
        if (inQuote && trimmed[i + 1] === '"') { cur += '"'; i++ }
        else inQuote = !inQuote
      } else if (ch === ',' && !inQuote) {
        cells.push(cur); cur = ''
      } else {
        cur += ch
      }
    }
    cells.push(cur)
    rows.push(cells)
  }
  return rows
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const url =
    'https://docs.google.com/spreadsheets/d/1k_7QA2zi2o-YZ3EjNO8bm28uM2BPIBi8-8iM1X3IK2g/export?format=csv&sheet=%D0%9E%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BA%D0%B0'
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) return { months: [], rows: [], byLabel: {} }
    const text = await res.text()
    const matrix = parseCSV(text)
    if (matrix.length < 2) return { months: [], rows: [], byLabel: {} }

    // First row: col 0 = empty header, cols 1.. = month names
    const months = matrix[0].slice(1).map(m => m.trim()).filter(Boolean)

    const rows: AnalyticsRow[] = []
    const byLabel: Record<string, number[]> = {}

    for (const cells of matrix.slice(1)) {
      const label = cells[0]?.trim()
      if (!label) continue
      const values = cells.slice(1, 1 + months.length).map(num)
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
