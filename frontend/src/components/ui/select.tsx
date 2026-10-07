import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  label?: string
  helper?: string
  error?: string
  icon?: LucideIcon
  placeholder?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function Select({ label, helper, error, icon: Icon, placeholder = 'Selecione', options, value, onValueChange, disabled, className }: SelectProps) {
  const message = error ?? helper

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <span className={cn('text-sm font-medium', error ? 'text-danger' : 'text-gray-700')}>{label}</span>}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger
          aria-label={label}
          className={cn(
            'flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 text-left text-base text-gray-800 outline-none transition-colors data-[placeholder]:text-gray-400 data-[state=open]:border-brand-base disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
            error ? 'border-danger' : 'border-gray-300 focus-visible:border-brand-base',
          )}
        >
          {Icon && <Icon className="size-4 shrink-0 text-gray-800" />}
          <span className="min-w-0 flex-1 truncate">
            <RadixSelect.Value placeholder={placeholder} />
          </span>
          <RadixSelect.Icon>
            <ChevronDown className="size-4 text-gray-500" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            sideOffset={4}
            className="z-50 w-(--radix-select-trigger-width) overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <RadixSelect.Viewport className="max-h-64 p-1">
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-gray-800 outline-none data-[highlighted]:bg-gray-100 data-[state=checked]:font-medium"
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator>
                    <Check className="size-4 text-success" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {message && <p className={cn('text-xs', error ? 'text-danger' : 'text-gray-500')}>{message}</p>}
    </div>
  )
}
