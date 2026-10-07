import { gql } from '@apollo/client'

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($data: TransactionInput!) {
    createTransaction(data: $data) {
      id
    }
  }
`

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $data: TransactionInput!) {
    updateTransaction(id: $id, data: $data) {
      id
    }
  }
`

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`

export const REFETCH_AFTER_CHANGE = ['Categories', 'CategoriesSummary', 'Transactions', 'DashboardSummary']
