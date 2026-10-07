import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/app-layout'
import { PublicOnly, RequireAuth } from '@/components/route-guards'
import Categories from '@/pages/Categories'
import Transactions from '@/pages/Transactions'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { useAuthStore } from '@/stores/auth'

function Home() {
  const token = useAuthStore((s) => s.token)
  return token ? (
    <AppLayout>
      <p className="text-gray-600">Dashboard em breve</p>
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
        </Route>
      </Route>
    </Routes>
  )
}
