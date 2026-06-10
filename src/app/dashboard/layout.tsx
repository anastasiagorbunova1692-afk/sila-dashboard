import { LogoutButton } from '@/components/LogoutButton'
import { AutoRefresh } from '@/components/AutoRefresh'

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const now = new Date()
  const monthName = MONTHS_RU[now.getMonth()]
  const year = now.getFullYear()
  const updatedAt = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AutoRefresh intervalMs={300_000} />

      <header
        className="sticky top-0 z-10 px-4 md:px-8 py-4"
        style={{
          background: 'rgba(10,10,10,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white leading-tight">
                SILA Картинг — {monthName} {year}
              </h1>
              <div className="flex items-center gap-1.5">
                <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                <span className="text-xs text-green-400">Live</span>
                <span className="text-xs text-gray-600 ml-1">· обновлено {updatedAt}</span>
              </div>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {children}
      </main>
    </div>
  )
}
