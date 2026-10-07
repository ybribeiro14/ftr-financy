import type { ComponentProps } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const iconButton = cva(
  'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-white',
  {
    variants: {
      variant: {
        default: 'text-gray-700 disabled:text-gray-300',
        danger: 'text-danger disabled:text-danger/40',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> &
  VariantProps<typeof iconButton> & { icon: LucideIcon; label: string }

export function IconButton({ icon: Icon, label, variant, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={cn(iconButton({ variant }), className)} {...props}>
      <Icon className="size-4" />
    </button>
  )
}
