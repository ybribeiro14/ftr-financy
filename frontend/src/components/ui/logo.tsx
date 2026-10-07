import logo from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="Financy" className={cn('h-8 w-auto', className)} />
}
