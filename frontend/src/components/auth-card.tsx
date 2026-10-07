import type { ReactNode } from 'react'
import { Logo } from '@/components/ui/logo'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 px-4 pb-10 pt-11">
      <Logo />
      <section className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8">
        <header className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <p className="mt-1 text-base text-gray-600">{subtitle}</p>
        </header>
        {children}
      </section>
    </main>
  )
}

export function AuthDivider() {
  return (
    <div className="my-6 flex items-center gap-3 text-sm text-gray-500">
      <span className="h-px flex-1 bg-gray-200" />
      ou
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  )
}
