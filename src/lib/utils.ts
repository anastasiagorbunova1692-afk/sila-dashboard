import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRubles(n: number): string {
  return n.toLocaleString('ru-RU') + ' ₽'
}

export function formatDelta(current: number, prev: number): { pct: string; up: boolean | null } {
  if (prev === 0) return { pct: '—', up: null }
  const pct = ((current - prev) / prev) * 100
  return { pct: Math.abs(pct).toFixed(1) + '%', up: pct >= 0 }
}
