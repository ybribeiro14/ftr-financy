import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const errorMessage = (error: unknown) =>
  error instanceof Error && error.message ? error.message : 'Algo deu errado. Tente novamente.'
