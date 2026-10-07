import type { ReactNode } from 'react'

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <p className="mt-1 text-base text-gray-600">{subtitle}</p>
      </div>
      {action}
    </div>
  )
}
