import { NextResponse } from 'next/server'
import { getMTDData } from '@/lib/sheets'

export async function GET() {
  const data = await getMTDData()
  return NextResponse.json(data)
}
