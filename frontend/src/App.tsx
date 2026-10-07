import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/app-layout'
import { PublicOnly, RequireAuth } from '@/components/route-guards'
import Categories from '@/pages/Categories'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import Register from '@/pages/Register'
import Transactions from '@/pages/Transactions'
import { useAuthStore } from '@/stores/auth'

function Home() {
  const token = useAuthStore((s) => s.token)
  return token ? (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ) : (
    <Login />
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PublicOnly />}>
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )
}
