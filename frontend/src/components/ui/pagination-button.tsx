import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function PaginationButton({ active, className, type = 'button', ...props }: ComponentProps<'button'> & { active?: boolean }) {
  return (
    <button
      type={type}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300',
        active
          ? 'border-brand-base bg-brand-base text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-200 disabled:hover:bg-white',
        className,
      )}
      {...props}
    />
  )
}
