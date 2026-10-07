import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export function RequireAuth() {
  const token = useAuthStore((s) => s.token)
  return token ? <Outlet /> : <Navigate to="/" replace />
}

export function PublicOnly() {
  const token = useAuthStore((s) => s.token)
  return token ? <Navigate to="/" replace /> : <Outlet />
}
