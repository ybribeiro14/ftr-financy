import { useQuery } from '@apollo/client/react'
import { ArrowDownCircle, ArrowUpCircle, ChevronRight, Plus, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryIcon } from '@/components/category-icon'
import { TransactionDialog } from '@/components/transaction-dialog'
import { Tag } from '@/components/ui/tag'
import { formatCurrency, formatDate, formatSignedCurrency } from '@/lib/format'
import { CATEGORIES, type CategoriesData } from '@/lib/graphql/queries/categories'
import {
  DASHBOARD_SUMMARY,
  TRANSACTIONS,
  type DashboardSummaryData,
  type TransactionsData,
  type TransactionsVars,
} from '@/lib/graphql/queries/transactions'
import { cn } from '@/lib/utils'

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-gray-800">{formatCurrency(value)}</p>
    </div>
  )
}

function CardHeader({ title, to, linkLabel }: { title: string; to: string; linkLabel: string }) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-200 px-6">
      <h2 className="text-xs uppercase tracking-wider text-gray-500">{title}</h2>
      <Link to={to} className="flex items-center gap-1 text-sm font-medium text-brand-base hover:underline">
        {linkLabel}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  )
}

export default function Dashboard() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: summaryData } = useQuery<DashboardSummaryData>(DASHBOARD_SUMMARY)
  const { data: transactionsData, loading } = useQuery<TransactionsData, TransactionsVars>(TRANSACTIONS, {
    variables: { page: 1, perPage: 5 },
  })
  const { data: categoriesData } = useQuery<CategoriesData>(CATEGORIES)

  const summary = summaryData?.dashboardSummary
  const transactions = transactionsData?.transactions.items ?? []
  const categories = [...(categoriesData?.categories ?? [])].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard icon={<Wallet className="size-5 text-purple-base" />} label="Saldo total" value={summary?.totalBalance ?? 0} />
        <StatCard icon={<ArrowUpCircle className="size-5 text-brand-base" />} label="Receitas do mês" value={summary?.monthIncome ?? 0} />
        <StatCard icon={<ArrowDownCircle className="size-5 text-danger" />} label="Despesas do mês" value={summary?.monthExpense ?? 0} />
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="rounded-xl border border-gray-200 bg-white">
          <CardHeader title="Transações recentes" to="/transactions" linkLabel="Ver todas" />
          {!loading && transactions.length === 0 && (
            <p className="px-6 py-10 text-center text-gray-500">Nenhuma transação registrada ainda</p>
          )}
          <ul>
            {transactions.map((t) => {
              const income = t.type === 'INCOME'
              const Icon = income ? ArrowUpCircle : ArrowDownCircle
              return (
                <li key={t.id} className="flex items-center gap-4 border-b border-gray-200 px-6 py-4">
                  <CategoryIcon icon={t.category.icon} color={t.category.color} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-800">{t.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(t.date)}</p>
                  </div>
                  <Tag color={t.category.color} className="hidden sm:inline-flex">
                    {t.category.title}
                  </Tag>
                  <div className="flex w-40 items-center justify-end gap-2 text-sm font-semibold text-gray-800">
                    {formatSignedCurrency(t.amount, t.type)}
                    <Icon className={cn('size-4', income ? 'text-brand-base' : 'text-danger')} />
                  </div>
                </li>
              )
            })}
          </ul>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 text-sm font-medium text-brand-base hover:underline"
          >
            <Plus className="size-4" />
            Nova transação
          </button>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <CardHeader title="Categorias" to="/categories" linkLabel="Gerenciar" />
          {categories.length === 0 && <p className="px-6 py-10 text-center text-gray-500">Nenhuma categoria ainda</p>}
          <ul className="flex flex-col gap-4 p-6">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2">
                <Tag color={c.color}>{c.title}</Tag>
                <span className="ml-auto text-sm text-gray-600">
                  {c.transactionCount} {c.transactionCount === 1 ? 'item' : 'itens'}
                </span>
                <span className="w-24 text-right text-sm font-semibold text-gray-800">{formatCurrency(c.totalAmount)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
