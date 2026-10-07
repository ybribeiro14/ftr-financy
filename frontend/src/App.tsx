import { Route, Routes } from 'react-router-dom'
import { PublicOnly } from '@/components/route-guards'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import { useAuthStore } from '@/stores/auth'

function Home() {
  const token = useAuthStore((s) => s.token)
  return token ? <main className="p-8">Logado</main> : <Login />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route element={<PublicOnly />}>
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  )
}
