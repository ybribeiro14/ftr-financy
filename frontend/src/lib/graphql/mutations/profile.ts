import { gql } from '@apollo/client'
import type { AuthUser } from '@/stores/auth'

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UpdateProfileInput!) {
    updateProfile(data: $data) {
      id
      name
      email
    }
  }
`

export interface UpdateProfileData {
  updateProfile: AuthUser
}
