import { useMutation, useQuery } from '@apollo/client/react'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CategoryIcon } from '@/components/category-icon'
import { PageHeader } from '@/components/page-header'
import { TransactionDialog } from '@/components/transaction-dialog'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { PaginationButton } from '@/components/ui/pagination-button'
import { Select } from '@/components/ui/select'
import { Tag } from '@/components/ui/tag'
import { TransactionType } from '@/components/ui/transaction-type'
import { formatDate, formatSignedCurrency, monthOptions } from '@/lib/format'
import { DELETE_TRANSACTION, REFETCH_AFTER_CHANGE } from '@/lib/graphql/mutations/transaction'
import { CATEGORIES, type CategoriesData } from '@/lib/graphql/queries/categories'
import { TRANSACTIONS, type TransactionsData, type TransactionsVars } from '@/lib/graphql/queries/transactions'
import { errorMessage } from '@/lib/utils'
import type { Transaction, TransactionKind } from '@/types'

const PER_PAGE = 10
const ALL = 'ALL'
const columns = 'grid grid-cols-[minmax(0,2fr)_80px_150px_100px_130px_90px] items-center gap-4 px-6'
const periods = monthOptions(12)

const typeOptions = [
  { value: ALL, label: 'Todos' },
  { value: 'INCOME', label: 'Entrada' },
  { value: 'EXPENSE', label: 'Saída' },
]

function pageNumbers(current: number, total: number) {
  const start = Math.max(1, Math.min(current - 2, total - 4))
  const end = Math.min(total, start + 4)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function Transactions() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState(ALL)
  const [categoryId, setCategoryId] = useState(ALL)
  const [period, setPeriod] = useState(periods[0].value)
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, 300)
    return () => clearTimeout(id)
  }, [searchInput])

  const filters: NonNullable<TransactionsVars['filters']> = {}
  if (search) filters.search = search
  if (type !== ALL) filters.type = type as TransactionKind
  if (categoryId !== ALL) filters.categoryId = categoryId
  if (period !== ALL) {
    const [year, month] = period.split('-').map(Number)
    filters.year = year
    filters.month = month
  }

  const { data, previousData, loading } = useQuery<TransactionsData, TransactionsVars>(TRANSACTIONS, {
    variables: { filters, page, perPage: PER_PAGE },
  })
  const { data: categoriesData } = useQuery<CategoriesData>(CATEGORIES)
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION)

  const result = (data ?? previousData)?.transactions
  const items = result?.items ?? []
  const total = result?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const from = total === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const to = Math.min(page * PER_PAGE, total)

  const categoryOptions = [
    { value: ALL, label: 'Todas' },
    ...(categoriesData?.categories ?? []).map((c) => ({ value: c.id, label: c.title })),
  ]
  const periodOptions = [{ value: ALL, label: 'Todo o período' }, ...periods]

  const change = (setter: (value: string) => void) => (value: string) => {
    setter(value)
    setPage(1)
  }

  const openDialog = (transaction: Transaction | null) => {
    setEditing(transaction)
    setDialogOpen(true)
  }

  const remove = async (transaction: Transaction) => {
    if (!window.confirm(`Excluir a transação "${transaction.description}"?`)) return
    try {
      await deleteTransaction({ variables: { id: transaction.id }, refetchQueries: REFETCH_AFTER_CHANGE, awaitRefetchQueries: true })
      toast.success('Transação excluída')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <>
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas transações financeiras"
        action={
          <Button size="sm" icon={Plus} onClick={() => openDialog(null)}>
            Nova transação
          </Button>
        }
      />

      <section className="mb-6 grid gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          label="Buscar"
          icon={Search}
          placeholder="Buscar por descrição"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Select label="Tipo" options={typeOptions} value={type} onValueChange={change(setType)} />
        <Select label="Categoria" options={categoryOptions} value={categoryId} onValueChange={change(setCategoryId)} />
        <Select label="Período" options={periodOptions} value={period} onValueChange={change(setPeriod)} />
      </section>

      <section className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <div className="min-w-[860px]">
          <div className={`${columns} h-14 text-xs font-medium uppercase tracking-wider text-gray-500`}>
            <span>Descrição</span>
            <span>Data</span>
            <span className="text-center">Categoria</span>
            <span className="text-center">Tipo</span>
            <span className="text-right">Valor</span>
            <span className="text-center">Ações</span>
          </div>

          {!loading && items.length === 0 && (
            <p className="border-t border-gray-200 px-6 py-10 text-center text-gray-500">Nenhuma transação encontrada</p>
          )}

          {items.map((t) => (
            <div key={t.id} className={`${columns} h-[72px] border-t border-gray-200`}>
              <div className="flex min-w-0 items-center gap-4">
                <CategoryIcon icon={t.category.icon} color={t.category.color} />
                <span className="truncate font-medium text-gray-800">{t.description}</span>
              </div>
              <span className="text-sm text-gray-600">{formatDate(t.date)}</span>
              <div className="flex justify-center">
                <Tag color={t.category.color}>{t.category.title}</Tag>
              </div>
              <div className="flex justify-center">
                <TransactionType type={t.type} />
              </div>
              <span className="text-right text-sm font-semibold text-gray-800">{formatSignedCurrency(t.amount, t.type)}</span>
              <div className="flex justify-center gap-2">
                <IconButton icon={Trash2} variant="danger" label="Excluir transação" onClick={() => remove(t)} />
                <IconButton icon={Pencil} label="Editar transação" onClick={() => openDialog(t)} />
              </div>
            </div>
          ))}

          <div className="flex h-16 items-center justify-between border-t border-gray-200 px-6 text-sm text-gray-700">
            <span>
              {from} a {to} | {total} {total === 1 ? 'resultado' : 'resultados'}
            </span>
            <nav className="flex items-center gap-2" aria-label="Paginação">
              <PaginationButton aria-label="Página anterior" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="size-4" />
              </PaginationButton>
              {pageNumbers(page, totalPages).map((n) => (
                <PaginationButton key={n} active={n === page} onClick={() => setPage(n)}>
                  {n}
                </PaginationButton>
              ))}
              <PaginationButton aria-label="Próxima página" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="size-4" />
              </PaginationButton>
            </nav>
          </div>
        </div>
      </section>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editing} />
    </>
  )
}
