import { useId, useState, type ComponentProps } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type InputProps = Omit<ComponentProps<'input'>, 'prefix'> & {
  label?: string
  helper?: string
  error?: string
  icon?: LucideIcon
  prefix?: string
}

export function Input({ label, helper, error, icon: Icon, prefix, className, type, disabled, id, value, ...props }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const message = error ?? helper

  return (
    <div className="group flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium text-gray-700 transition-colors',
            !error && 'group-focus-within:text-brand-base!',
            error && 'text-danger',
          )}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-11 items-center gap-2 rounded-lg border bg-white px-3 transition-colors',
          error ? 'border-danger' : 'border-gray-300 focus-within:border-brand-base',
          disabled && 'border-gray-200 bg-gray-100',
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              'size-4 shrink-0',
              error
                ? 'text-danger'
                : 'text-gray-400 group-has-[input:not(:placeholder-shown)]:text-gray-800 group-focus-within:text-brand-base!',
            )}
          />
        )}
        {prefix && <span className="text-base text-gray-800">{prefix}</span>}
        <input
          id={inputId}
          type={isPassword && visible ? 'text' : type}
          disabled={disabled}
          value={value}
          aria-invalid={!!error}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400 disabled:text-gray-400',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            onClick={() => setVisible((v) => !v)}
            className="cursor-pointer text-gray-800"
          >
            {visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          </button>
        )}
      </div>
      {message && <p className={cn('text-xs', error ? 'text-danger' : 'text-gray-500')}>{message}</p>}
    </div>
  )
}
