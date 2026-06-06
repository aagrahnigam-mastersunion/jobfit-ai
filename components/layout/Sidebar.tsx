'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: 'home' },
  { href: '/analyse', label: 'Analyse', icon: 'analytics' },
  { href: '/history', label: 'History', icon: 'history' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 w-[80px] lg:w-[240px] h-screen flex flex-col bg-elevated-surface-2 z-50 py-6">
      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start lg:px-6 gap-3 mb-8">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
          work_history
        </span>
        <span
          className="hidden lg:block text-primary font-bold text-xl"
          style={{ fontFamily: 'Source Sans 3' }}
        >
          JobFit AI
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 w-full px-2 lg:px-3 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <div key={item.href} className="flex justify-center lg:block">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-4 transition-colors group',
                  isActive
                    ? 'bg-primary-container text-on-primary-container rounded-full w-14 h-8 justify-center lg:w-full lg:h-auto lg:justify-start lg:px-4 lg:py-3'
                    : 'text-on-surface-variant hover:bg-surface-variant rounded-full lg:rounded-xl p-2 lg:p-0 justify-center lg:justify-start lg:px-4 lg:py-3 lg:w-full'
                )}
              >
                <span
                  className="material-symbols-outlined transition-transform group-active:scale-90"
                  style={{
                    fontSize: '22px',
                    ...(isActive ? { fontVariationSettings: "'FILL' 1" } : {}),
                  }}
                >
                  {item.icon}
                </span>
                <span
                  className="hidden lg:block text-sm font-medium"
                  style={{ fontFamily: 'Roboto Flex', letterSpacing: '0.1px' }}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-2 lg:px-3">
        <div className="flex justify-center lg:block">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-4 text-on-surface-variant hover:bg-surface-variant transition-colors rounded-full lg:rounded-xl p-2 lg:p-0 lg:px-4 lg:py-3 lg:w-full group"
          >
            <span
              className="material-symbols-outlined transition-transform group-active:scale-90"
              style={{ fontSize: '22px' }}
            >
              logout
            </span>
            <span
              className="hidden lg:block text-sm font-medium"
              style={{ fontFamily: 'Roboto Flex' }}
            >
              Sign out
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
