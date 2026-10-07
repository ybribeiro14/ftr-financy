import { useMutation } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/categories'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/lib/graphql/mutations/category'
import { REFETCH_AFTER_CHANGE } from '@/lib/graphql/mutations/transaction'
import { cn, errorMessage } from '@/lib/utils'
import type { Category } from '@/types'

const schema = z.object({
  title: z.string().trim().min(1, 'Informe o título'),
  description: z.string().trim().max(200, 'A descrição deve ter no máximo 200 caracteres'),
  icon: z.string().min(1, 'Selecione um ícone'),
  color: z.string().min(1, 'Selecione uma cor'),
})

type FormValues = z.infer<typeof schema>

const emptyValues: FormValues = { title: '', description: '', icon: 'briefcase-business', color: 'green' }

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const editing = !!category
  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY)
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues })

  useEffect(() => {
    if (!open) return
    reset(
      category
        ? { title: category.title, description: category.description ?? '', icon: category.icon, color: category.color }
        : emptyValues,
    )
  }, [open, category, reset])

  const onSubmit = handleSubmit(async (values) => {
    const data = { ...values, description: values.description || null }
    const options = { refetchQueries: REFETCH_AFTER_CHANGE, awaitRefetchQueries: true }
    try {
      if (category) await updateCategory({ variables: { id: category.id, data }, ...options })
      else await createCategory({ variables: { data }, ...options })
      toast.success(editing ? 'Categoria atualizada' : 'Categoria criada')
      onOpenChange(false)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? 'Editar categoria' : 'Nova categoria'}
      description={editing ? 'Atualize os dados da categoria' : 'Organize suas transações com categorias'}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Input label="Título" placeholder="Ex. Alimentação" error={errors.title?.message} {...register('title')} />
        <Input
          label="Descrição"
          placeholder="Descrição da categoria"
          helper="Opcional"
          error={errors.description?.message}
          {...register('description')}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-medium text-gray-700">Ícone</legend>
              <div className="grid grid-cols-8 gap-2">
                {Object.entries(CATEGORY_ICONS).map(([name, Icon]) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={name}
                    aria-pressed={field.value === name}
                    onClick={() => field.onChange(name)}
                    className={cn(
                      'flex size-9 cursor-pointer items-center justify-center rounded-lg border bg-white text-gray-600 transition-colors hover:bg-gray-100',
                      field.value === name ? 'border-brand-base text-gray-800' : 'border-gray-300',
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-medium text-gray-700">Cor</legend>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(CATEGORY_COLORS).map(([name, { solid }]) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={name}
                    aria-pressed={field.value === name}
                    onClick={() => field.onChange(name)}
                    className={cn(
                      'flex h-8 cursor-pointer items-center justify-center rounded-lg border bg-white p-1',
                      field.value === name ? 'border-brand-base' : 'border-gray-300',
                    )}
                  >
                    <span className={cn('block h-full w-full rounded', solid)} />
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        />

        <Button type="submit" disabled={creating || updating} className="mt-2">
          {creating || updating ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Dialog>
  )
}
