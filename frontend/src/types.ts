export type TransactionKind = 'INCOME' | 'EXPENSE'

export interface CategoryRef {
  id: string
  title: string
  icon: string
  color: string
}

export interface Category extends CategoryRef {
  description: string | null
  transactionCount: number
  totalAmount: number
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: TransactionKind
  categoryId: string
  category: CategoryRef
}
