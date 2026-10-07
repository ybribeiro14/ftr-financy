import type { Category } from '@prisma/client'
import { prisma } from '../lib/prisma'
import type { CategoryInput } from '../dtos/input/category.input'

async function withStats(userId: string, categories: Category[]) {
  const groups = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId },
    _count: { _all: true },
    _sum: { amount: true },
  })
  const stats = new Map(groups.map((g) => [g.categoryId, g]))

  return categories.map((c) => ({
    ...c,
    transactionCount: stats.get(c.id)?._count._all ?? 0,
    totalAmount: stats.get(c.id)?._sum.amount ?? 0,
  }))
}

export class CategoryService {
  async list(userId: string) {
    const categories = await prisma.category.findMany({ where: { userId }, orderBy: { title: 'asc' } })
    return withStats(userId, categories)
  }

  async summary(userId: string) {
    const categories = await this.list(userId)
    const totalTransactions = categories.reduce((sum, c) => sum + c.transactionCount, 0)
    const top = categories.reduce<(typeof categories)[number] | null>(
      (best, c) => (c.transactionCount > (best?.transactionCount ?? 0) ? c : best),
      null,
    )
    return { totalCategories: categories.length, totalTransactions, mostUsedCategory: top }
  }

  async create(userId: string, data: CategoryInput) {
    const category = await prisma.category.create({ data: this.clean(data, userId) })
    return (await withStats(userId, [category]))[0]
  }

  async update(userId: string, id: string, data: CategoryInput) {
    await this.findOwned(userId, id)
    const category = await prisma.category.update({ where: { id }, data: this.clean(data, userId) })
    return (await withStats(userId, [category]))[0]
  }

  async delete(userId: string, id: string) {
    await this.findOwned(userId, id)
    const count = await prisma.transaction.count({ where: { categoryId: id, userId } })
    if (count > 0) throw new Error('Não é possível excluir uma categoria que possui transações')
    await prisma.category.delete({ where: { id } })
    return true
  }

  async findOwned(userId: string, id: string) {
    const category = await prisma.category.findFirst({ where: { id, userId } })
    if (!category) throw new Error('Categoria não encontrada')
    return category
  }

  private clean({ title, description, icon, color }: CategoryInput, userId: string) {
    return { title: title.trim(), description: description?.trim() || null, icon, color, userId }
  }
}
