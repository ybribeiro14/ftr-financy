import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { IconButton } from '@/components/ui/icon-button'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
}

export function Dialog({ open, onOpenChange, title, description, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-gray-800/25" />
        <RadixDialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl outline-none">
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              <RadixDialog.Title className="text-base font-semibold text-gray-800">{title}</RadixDialog.Title>
              <RadixDialog.Description className="text-sm text-gray-600">{description}</RadixDialog.Description>
            </div>
            <RadixDialog.Close asChild>
              <IconButton icon={X} label="Fechar" />
            </RadixDialog.Close>
          </header>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
