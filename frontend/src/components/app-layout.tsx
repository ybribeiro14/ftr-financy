import type { ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/ui/logo'
import { initials } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transações' },
  { to: '/categories', label: 'Categorias' },
]

export function AppLayout({ children }: { children?: ReactNode }) {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-y-2 px-4 py-3 sm:h-16 sm:grid-cols-[1fr_auto_1fr] sm:py-0 sm:px-6">
          <Link to="/" aria-label="Financy">
            <Logo />
          </Link>
          <nav className="order-last col-span-2 flex items-center justify-center gap-5 text-sm sm:order-none sm:col-span-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn('transition-colors hover:text-gray-800', isActive ? 'font-semibold text-brand-base hover:text-brand-base' : 'text-gray-600')
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/profile"
            aria-label="Perfil"
            className="ml-auto flex size-9 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-800"
          >
            {initials(user?.name ?? '')}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children ?? <Outlet />}</main>
    </div>
  )
}
