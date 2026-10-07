import type { ReactNode } from 'react'
import { categoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function Tag({ color, children, className }: { color?: string; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium',
        color ? categoryColor(color).soft : 'bg-gray-200 text-gray-700',
        className,
      )}
    >
      {children}
    </span>
  )
}
