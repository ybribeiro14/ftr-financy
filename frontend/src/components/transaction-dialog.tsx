import { useMutation, useQuery } from '@apollo/client/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { dateToInput, formatAmountInput, inputToApiDate, todayInput } from '@/lib/format'
import { CATEGORIES, type CategoriesData } from '@/lib/graphql/queries/categories'
import { CREATE_TRANSACTION, REFETCH_AFTER_CHANGE, UPDATE_TRANSACTION } from '@/lib/graphql/mutations/transaction'
import { cn, errorMessage } from '@/lib/utils'
import type { Transaction } from '@/types'

const schema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().trim().min(1, 'Informe a descrição').max(120, 'A descrição deve ter no máximo 120 caracteres'),
  date: z.string().min(1, 'Informe a data'),
  amount: z.number().int().positive('Informe um valor maior que zero'),
  categoryId: z.string().min(1, 'Selecione a categoria'),
})

type FormValues = z.infer<typeof schema>

const emptyValues = (): FormValues => ({ type: 'EXPENSE', description: '', date: todayInput(), amount: 0, categoryId: '' })

const kinds = [
  { value: 'EXPENSE', label: 'Despesa', icon: ArrowDownCircle, active: 'border-danger text-gray-800 [&>svg]:text-danger' },
  { value: 'INCOME', label: 'Receita', icon: ArrowUpCircle, active: 'border-success text-gray-800 [&>svg]:text-success' },
] as const

interface TransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
}

export function TransactionDialog({ open, onOpenChange, transaction }: TransactionDialogProps) {
  const editing = !!transaction
  const { data } = useQuery<CategoriesData>(CATEGORIES, { skip: !open })
  const [createTransaction, { loading: creating }] = useMutation(CREATE_TRANSACTION)
  const [updateTransaction, { loading: updating }] = useMutation(UPDATE_TRANSACTION)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: emptyValues() })

  useEffect(() => {
    if (!open) return
    reset(
      transaction
        ? {
            type: transaction.type,
            description: transaction.description,
            date: dateToInput(transaction.date),
            amount: transaction.amount,
            categoryId: transaction.categoryId,
          }
        : emptyValues(),
    )
  }, [open, transaction, reset])

  const onSubmit = handleSubmit(async (values) => {
    const input = { ...values, date: inputToApiDate(values.date) }
    const options = { refetchQueries: REFETCH_AFTER_CHANGE, awaitRefetchQueries: true }
    try {
      if (transaction) await updateTransaction({ variables: { id: transaction.id, data: input }, ...options })
      else await createTransaction({ variables: { data: input }, ...options })
      toast.success(editing ? 'Transação atualizada' : 'Transação criada')
      onOpenChange(false)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  })

  const categories = (data?.categories ?? []).map((c) => ({ value: c.id, label: c.title }))

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={editing ? 'Editar transação' : 'Nova transação'}
      description={editing ? 'Atualize os dados da transação' : 'Registre sua despesa ou receita'}
    >
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-white p-1">
              {kinds.map(({ value, label, icon: Icon, active }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={field.value === value}
                  onClick={() => field.onChange(value)}
                  className={cn(
                    'flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border text-base transition-colors',
                    field.value === value ? active : 'border-transparent text-gray-600 hover:bg-gray-100 [&>svg]:text-gray-400',
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        />

        <Input
          label="Descrição"
          placeholder="Ex. Almoço no restaurante"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="Data" type="date" error={errors.date?.message} {...register('date')} />
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <Input
                label="Valor"
                prefix="R$"
                inputMode="numeric"
                placeholder="0,00"
                error={errors.amount?.message}
                value={field.value ? formatAmountInput(field.value) : ''}
                onChange={(e) => field.onChange(Number(e.target.value.replace(/\D/g, '')))}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              label="Categoria"
              placeholder="Selecione"
              options={categories}
              value={field.value || undefined}
              onValueChange={field.onChange}
              error={errors.categoryId?.message}
            />
          )}
        />

        <Button type="submit" disabled={creating || updating} className="mt-2">
          {creating || updating ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </Dialog>
  )
}
