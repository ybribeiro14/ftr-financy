import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { periodRange } from './transaction.service'

async function totals(where: Prisma.TransactionWhereInput) {
  const groups = await prisma.transaction.groupBy({ by: ['type'], where, _sum: { amount: true } })
  const sum = (type: 'INCOME' | 'EXPENSE') => groups.find((g) => g.type === type)?._sum.amount ?? 0
  return { income: sum('INCOME'), expense: sum('EXPENSE') }
}

export class DashboardService {
  async summary(userId: string, month?: number | null, year?: number | null) {
    const now = new Date()
    const range = periodRange(month ?? now.getUTCMonth() + 1, year ?? now.getUTCFullYear())

    const [all, period] = await Promise.all([totals({ userId }), totals({ userId, date: range })])
    return { totalBalance: all.income - all.expense, monthIncome: period.income, monthExpense: period.expense }
  }
}
