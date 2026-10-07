import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { useId, type ComponentProps } from 'react'

export function Checkbox({ label, ...props }: ComponentProps<typeof RadixCheckbox.Root> & { label: string }) {
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <RadixCheckbox.Root
        id={id}
        className="flex size-4 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white data-[state=checked]:border-brand-base data-[state=checked]:bg-brand-base"
        {...props}
      >
        <RadixCheckbox.Indicator>
          <Check className="size-3 text-white" strokeWidth={3} />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={id} className="cursor-pointer text-sm text-gray-700">
        {label}
      </label>
    </div>
  )
}
