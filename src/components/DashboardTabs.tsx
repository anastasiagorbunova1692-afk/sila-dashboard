'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DashboardTabs() {
  const pathname = usePathname()
  const tabs = [
    { label: 'Текущий месяц', href: '/dashboard' },
    { label: 'Аналитика', href: '/dashboard/analytics' },
  ]
  return (
    <nav className="flex gap-1 px-4 md:px-8 pt-4 max-w-7xl mx-auto">
      {tabs.map((tab) => {
        const active =
          pathname === tab.href ||
          (tab.href !== '/dashboard' && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
