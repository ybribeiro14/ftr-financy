import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, LogIn, Mail, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthCard, AuthDivider } from '@/components/auth-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { REGISTER, type RegisterData } from '@/lib/graphql/mutations/auth'
import { errorMessage } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const schema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome completo'),
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

type FormValues = z.infer<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [registerUser, { loading }] = useMutation<RegisterData>(REGISTER)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await registerUser({ variables: { data } })
      if (!result.data) return
      setSession(result.data.register.token, result.data.register.user)
      toast.success('Conta criada com sucesso')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  return (
    <AuthCard title="Criar conta" subtitle="Comece a controlar suas finanças ainda hoje">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Nome completo"
          icon={User}
          placeholder="Seu nome completo"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="E-mail"
          type="email"
          icon={Mail}
          placeholder="mail@exemplo.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Senha"
          type="password"
          icon={Lock}
          placeholder="Digite sua senha"
          autoComplete="new-password"
          helper="A senha deve ter no mínimo 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
      <AuthDivider />
      <p className="mb-4 text-center text-sm text-gray-600">Já tem uma conta?</p>
      <Button variant="outline" icon={LogIn} className="w-full" onClick={() => navigate('/')}>
        Fazer login
      </Button>
    </AuthCard>
  )
}
