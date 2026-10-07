import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogOut, Mail, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { initials } from '@/lib/format'
import { UPDATE_PROFILE, type UpdateProfileData } from '@/lib/graphql/mutations/profile'
import { errorMessage } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth'

const schema = z.object({ name: z.string().trim().min(1, 'Informe seu nome completo') })

type FormValues = z.infer<typeof schema>

export default function Profile() {
  const { user, setUser, logout } = useAuthStore()
  const [updateProfile, { loading }] = useMutation<UpdateProfileData>(UPDATE_PROFILE)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: user?.name ?? '' } })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const result = await updateProfile({ variables: { data } })
      if (result.data) setUser(result.data.updateProfile)
      toast.success('Perfil atualizado')
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  return (
    <section className="mx-auto mt-4 w-full max-w-md rounded-xl border border-gray-200 bg-white p-8">
      <div className="flex flex-col items-center border-b border-gray-200 pb-8 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-gray-300 text-2xl text-gray-800">
          {initials(user?.name ?? '')}
        </span>
        <h1 className="mt-4 text-xl font-semibold text-gray-800">{user?.name}</h1>
        <p className="text-base text-gray-600">{user?.email}</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-4">
        <Input label="Nome completo" icon={User} error={errors.name?.message} {...register('name')} />
        <Input label="E-mail" icon={Mail} value={user?.email ?? ''} disabled readOnly helper="O e-mail não pode ser alterado" />
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </Button>
        <Button variant="outline" icon={LogOut} onClick={logout} className="[&>svg]:text-danger">
          Sair da conta
        </Button>
      </form>
    </section>
  )
}
