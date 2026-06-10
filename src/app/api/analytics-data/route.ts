import { NextResponse } from 'next/server'

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZDsLoL7jDuhMqXuwlyleAL_ueRRT7XdUV9BSpgG3ubxlBW1g4IMiWROBAn9rNMu9iwzrWftlh7Ypv/pub?output=csv&gid=1815316927'

export async function GET() {
  try {
    const res = await fetch(CSV_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    })
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 })
    }
    const csv = await res.text()
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Cache-Control': 'max-age=300',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 })
  }
}
