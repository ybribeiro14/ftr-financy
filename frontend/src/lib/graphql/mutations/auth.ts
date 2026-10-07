import { gql } from '@apollo/client'
import type { AuthUser } from '@/stores/auth'

export const LOGIN = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export const REGISTER = gql`
  mutation Register($data: RegisterInput!) {
    register(data: $data) {
      token
      user {
        id
        name
        email
      }
    }
  }
`

export interface AuthPayload {
  token: string
  user: AuthUser
}

export interface LoginData {
  login: AuthPayload
}

export interface RegisterData {
  register: AuthPayload
}
