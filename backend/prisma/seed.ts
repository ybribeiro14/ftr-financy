import 'dotenv/config'
import { PrismaClient, TransactionType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const categories = [
  { title: 'Alimentação', description: 'Restaurantes, delivery e refeições', icon: 'utensils', color: 'blue' },
  { title: 'Entretenimento', description: 'Cinema, jogos e lazer', icon: 'ticket', color: 'pink' },
  { title: 'Investimento', description: 'Aplicações e retornos financeiros', icon: 'piggy-bank', color: 'green' },
  { title: 'Mercado', description: 'Compras de supermercado e mantimentos', icon: 'shopping-cart', color: 'orange' },
  { title: 'Salário', description: 'Renda mensal e bonificações', icon: 'briefcase-business', color: 'green' },
  { title: 'Saúde', description: 'Medicamentos, consultas e exames', icon: 'heart-pulse', color: 'red' },
  { title: 'Transporte', description: 'Gasolina, transporte público e viagens', icon: 'car-front', color: 'purple' },
  { title: 'Utilidades', description: 'Energia, água, internet e telefone', icon: 'package-open', color: 'yellow' },
]

const transactions: [string, number, number, TransactionType, string][] = [
  ['Pagamento de Salário', 425000, 28, 'INCOME', 'Salário'],
  ['Jantar no Restaurante', 8950, 27, 'EXPENSE', 'Alimentação'],
  ['Posto de Gasolina', 10000, 26, 'EXPENSE', 'Transporte'],
  ['Compras no Mercado', 15680, 25, 'EXPENSE', 'Mercado'],
  ['Retorno de Investimento', 34025, 23, 'INCOME', 'Investimento'],
  ['Aluguel', 170000, 20, 'EXPENSE', 'Utilidades'],
  ['Freelance', 250000, 15, 'INCOME', 'Salário'],
  ['Compras Jantar', 15000, 10, 'EXPENSE', 'Mercado'],
  ['Cinema', 8800, 5, 'EXPENSE', 'Entretenimento'],
]

const now = new Date()
const dayOfCurrentMonth = (day: number) =>
  new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day, 12))

async function main() {
  const email = 'conta@teste.com'
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: 'Conta teste', email, password: await bcrypt.hash('12345678', 10) },
  })

  await prisma.transaction.deleteMany({ where: { userId: user.id } })
  await prisma.category.deleteMany({ where: { userId: user.id } })

  const created = new Map<string, string>()
  for (const c of categories) {
    const { id } = await prisma.category.create({ data: { ...c, userId: user.id } })
    created.set(c.title, id)
  }

  for (const [description, amount, day, type, category] of transactions) {
    await prisma.transaction.create({
      data: { description, amount, date: dayOfCurrentMonth(day), type, categoryId: created.get(category)!, userId: user.id },
    })
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
