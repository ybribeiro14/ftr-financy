import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TransactionType({ type, className }: { type: 'INCOME' | 'EXPENSE'; className?: string }) {
  const income = type === 'INCOME'
  const Icon = income ? ArrowUpCircle : ArrowDownCircle
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', income ? 'text-green-dark' : 'text-red-dark', className)}>
      <Icon className="size-4" />
      {income ? 'Entrada' : 'Saída'}
    </span>
  )
}
