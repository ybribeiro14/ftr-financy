import { gql } from '@apollo/client'
import type { Category, CategoryRef } from '@/types'

export const CATEGORIES = gql`
  query Categories {
    categories {
      id
      title
      description
      icon
      color
      transactionCount
      totalAmount
    }
  }
`

export const CATEGORIES_SUMMARY = gql`
  query CategoriesSummary {
    categoriesSummary {
      totalCategories
      totalTransactions
      mostUsedCategory {
        id
        title
        icon
        color
      }
    }
  }
`

export interface CategoriesData {
  categories: Category[]
}

export interface CategoriesSummaryData {
  categoriesSummary: {
    totalCategories: number
    totalTransactions: number
    mostUsedCategory: CategoryRef | null
  }
}
