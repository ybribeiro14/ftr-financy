import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const button = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium transition-colors disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'border-transparent bg-brand-base text-white hover:bg-brand-dark disabled:bg-brand-base/50 disabled:hover:bg-brand-base/50',
        outline:
          'border-gray-300 bg-white text-gray-700 hover:bg-gray-200 disabled:border-gray-200 disabled:bg-white disabled:text-gray-400',
      },
      size: {
        md: 'h-11 px-4 text-base',
        sm: 'h-8 px-3 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button> & { icon?: LucideIcon }

export function Button({ variant, size, icon: Icon, className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(button({ variant, size }), className)} {...props}>
      {Icon && <Icon className={size === 'sm' ? 'size-4' : 'size-5'} />}
      {children}
    </button>
  )
}
