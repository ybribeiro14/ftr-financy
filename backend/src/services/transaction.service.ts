import type { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'
import type { TransactionFiltersInput, TransactionInput } from '../dtos/input/transaction.input'

const include = {
  category: { select: { id: true, title: true, icon: true, color: true } },
} satisfies Prisma.TransactionInclude

export function periodRange(month?: number | null, year?: number | null) {
  if (!year) {
    if (month) throw new Error('Informe o ano junto com o mês')
    return undefined
  }
  const start = new Date(Date.UTC(year, month ? month - 1 : 0, 1))
  const end = new Date(Date.UTC(month ? year : year + 1, month ?? 0, 1))
  return { gte: start, lt: end }
}

export class TransactionService {
  async list(userId: string, filters: TransactionFiltersInput | undefined, page: number, perPage: number) {
    const currentPage = Math.max(1, Math.floor(page))
    const take = Math.min(50, Math.max(1, Math.floor(perPage)))

    const where: Prisma.TransactionWhereInput = { userId }
    const search = filters?.search?.trim()
    if (search) where.description = { contains: search }
    if (filters?.type) where.type = filters.type
    if (filters?.categoryId) where.categoryId = filters.categoryId
    const range = periodRange(filters?.month, filters?.year)
    if (range) where.date = range

    const [items, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        include,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (currentPage - 1) * take,
        take,
      }),
      prisma.transaction.count({ where }),
    ])
    return { items, total, page: currentPage, perPage: take }
  }

  async create(userId: string, data: TransactionInput) {
    await this.assertCategory(userId, data.categoryId)
    return prisma.transaction.create({ data: this.clean(data, userId), include })
  }

  async update(userId: string, id: string, data: TransactionInput) {
    await this.findOwned(userId, id)
    await this.assertCategory(userId, data.categoryId)
    return prisma.transaction.update({ where: { id }, data: this.clean(data, userId), include })
  }

  async delete(userId: string, id: string) {
    await this.findOwned(userId, id)
    await prisma.transaction.delete({ where: { id } })
    return true
  }

  private async findOwned(userId: string, id: string) {
    const transaction = await prisma.transaction.findFirst({ where: { id, userId } })
    if (!transaction) throw new Error('Transação não encontrada')
    return transaction
  }

  private async assertCategory(userId: string, categoryId: string) {
    if (!(await prisma.category.findFirst({ where: { id: categoryId, userId }, select: { id: true } }))) {
      throw new Error('Categoria não encontrada')
    }
  }

  private clean({ description, amount, date, type, categoryId }: TransactionInput, userId: string) {
    return { description: description.trim(), amount, date, type, categoryId, userId }
  }
}
