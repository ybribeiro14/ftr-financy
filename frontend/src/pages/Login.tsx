import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, UserPlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthCard, AuthDivider } from '@/components/auth-card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { LOGIN, type LoginData } from '@/lib/graphql/mutations/auth'
import { errorMessage } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const schema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
})

type FormValues = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const [login, { loading }] = useMutation<LoginData>(LOGIN)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await login({ variables: { data } })
      if (!result.data) return
      setSession(result.data.login.token, result.data.login.user)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  return (
    <AuthCard title="Fazer login" subtitle="Entre na sua conta para continuar">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
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
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="flex items-center justify-between">
          <Checkbox label="Lembrar-me" />
          <button
            type="button"
            onClick={() => toast.info('Recuperação de senha ainda não está disponível')}
            className="cursor-pointer text-sm font-medium text-brand-base hover:underline"
          >
            Recuperar senha
          </button>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
      <AuthDivider />
      <p className="mb-4 text-center text-sm text-gray-600">Ainda não tem uma conta?</p>
      <Button variant="outline" icon={UserPlus} className="w-full" onClick={() => navigate('/register')}>
        Criar conta
      </Button>
    </AuthCard>
  )
}
