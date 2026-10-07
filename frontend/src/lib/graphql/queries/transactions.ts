import { gql } from '@apollo/client'
import type { Transaction, TransactionKind } from '@/types'

export const TRANSACTIONS = gql`
  query Transactions($filters: TransactionFiltersInput, $page: Int, $perPage: Int) {
    transactions(filters: $filters, page: $page, perPage: $perPage) {
      total
      page
      perPage
      items {
        id
        description
        amount
        date
        type
        categoryId
        category {
          id
          title
          icon
          color
        }
      }
    }
  }
`

export const DASHBOARD_SUMMARY = gql`
  query DashboardSummary($month: Int, $year: Int) {
    dashboardSummary(month: $month, year: $year) {
      totalBalance
      monthIncome
      monthExpense
    }
  }
`

export interface TransactionsData {
  transactions: { total: number; page: number; perPage: number; items: Transaction[] }
}

export interface TransactionsVars {
  filters?: {
    search?: string
    type?: TransactionKind
    categoryId?: string
    month?: number
    year?: number
  }
  page?: number
  perPage?: number
}

export interface DashboardSummaryData {
  dashboardSummary: { totalBalance: number; monthIncome: number; monthExpense: number }
}
