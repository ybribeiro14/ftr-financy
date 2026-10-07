import { useMutation, useQuery } from '@apollo/client/react'
import { ArrowDownUp, Pencil, Plus, Tag as TagIcon, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { CategoryDialog } from '@/components/category-dialog'
import { CategoryIcon } from '@/components/category-icon'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Tag } from '@/components/ui/tag'
import { CATEGORY_ICONS, categoryColor } from '@/lib/categories'
import { DELETE_CATEGORY } from '@/lib/graphql/mutations/category'
import { REFETCH_AFTER_CHANGE } from '@/lib/graphql/mutations/transaction'
import {
  CATEGORIES,
  CATEGORIES_SUMMARY,
  type CategoriesData,
  type CategoriesSummaryData,
} from '@/lib/graphql/queries/categories'
import { cn, errorMessage } from '@/lib/utils'
import type { Category } from '@/types'

const itemsLabel = (count: number) => `${count} ${count === 1 ? 'item' : 'itens'}`

function SummaryCard({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div>
          <p className="text-2xl font-bold leading-7 text-gray-800">{children}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function Categories() {
  const { data, loading } = useQuery<CategoriesData>(CATEGORIES)
  const { data: summaryData } = useQuery<CategoriesSummaryData>(CATEGORIES_SUMMARY)
  const [deleteCategory] = useMutation(DELETE_CATEGORY)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const categories = data?.categories ?? []
  const summary = summaryData?.categoriesSummary
  const top = summary?.mostUsedCategory
  const TopIcon = top ? CATEGORY_ICONS[top.icon] ?? TagIcon : null

  const openDialog = (category: Category | null) => {
    setEditing(category)
    setDialogOpen(true)
  }

  const remove = async (category: Category) => {
    if (!window.confirm(`Excluir a categoria "${category.title}"?`)) return
    try {
      await deleteCategory({ variables: { id: category.id }, refetchQueries: REFETCH_AFTER_CHANGE, awaitRefetchQueries: true })
      toast.success('Categoria excluída')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <>
      <PageHeader
        title="Categorias"
        subtitle="Organize suas transações por categorias"
        action={
          <Button size="sm" icon={Plus} onClick={() => openDialog(null)}>
            Nova categoria
          </Button>
        }
      />

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <SummaryCard icon={<TagIcon className="size-6 text-gray-700" />} label="Total de categorias">
          {summary?.totalCategories ?? 0}
        </SummaryCard>
        <SummaryCard icon={<ArrowDownUp className="size-6 text-purple-base" />} label="Total de transações">
          {summary?.totalTransactions ?? 0}
        </SummaryCard>
        <SummaryCard
          icon={TopIcon && top ? <TopIcon className={cn('size-6', categoryColor(top.color).soft.split(' ')[1])} /> : null}
          label="Categoria mais utilizada"
        >
          {top?.title ?? '-'}
        </SummaryCard>
      </div>

      {!loading && categories.length === 0 && (
        <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          Nenhuma categoria cadastrada. Crie a primeira em &quot;Nova categoria&quot;.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <article key={category.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
              <CategoryIcon icon={category.icon} color={category.color} />
              <div className="flex gap-2">
                <IconButton icon={Trash2} variant="danger" label="Excluir categoria" onClick={() => remove(category)} />
                <IconButton icon={Pencil} label="Editar categoria" onClick={() => openDialog(category)} />
              </div>
            </div>
            <h2 className="mt-4 text-base font-semibold text-gray-800">{category.title}</h2>
            <p className="mt-1 min-h-10 text-sm text-gray-600">{category.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <Tag color={category.color}>{category.title}</Tag>
              <span className="text-sm text-gray-600">{itemsLabel(category.transactionCount)}</span>
            </div>
          </article>
        ))}
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editing} />
    </>
  )
}
