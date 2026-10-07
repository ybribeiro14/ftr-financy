import { Tag } from 'lucide-react'
import { CATEGORY_ICONS, categoryColor } from '@/lib/categories'
import { cn } from '@/lib/utils'

export function CategoryIcon({ icon, color, className }: { icon: string; color: string; className?: string }) {
  const Icon = CATEGORY_ICONS[icon] ?? Tag
  return (
    <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', categoryColor(color).soft, className)}>
      <Icon className="size-5" />
    </span>
  )
}
