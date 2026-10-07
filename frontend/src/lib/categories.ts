import {
  BookOpen, BriefcaseBusiness, CarFront, Dumbbell, Gift, HeartPulse, House, Luggage, PackageOpen,
  PawPrint, PiggyBank, ReceiptText, ShoppingCart, Ticket, Utensils, WalletCards, type LucideIcon,
} from 'lucide-react'

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  ticket: Ticket,
  'package-open': PackageOpen,
  utensils: Utensils,
  'paw-print': PawPrint,
  house: House,
  gift: Gift,
  dumbbell: Dumbbell,
  'book-open': BookOpen,
  luggage: Luggage,
  'wallet-cards': WalletCards,
  'receipt-text': ReceiptText,
}

export const CATEGORY_COLORS = {
  green: { soft: 'bg-green-light text-green-dark', solid: 'bg-green-base' },
  blue: { soft: 'bg-blue-light text-blue-dark', solid: 'bg-blue-base' },
  purple: { soft: 'bg-purple-light text-purple-dark', solid: 'bg-purple-base' },
  pink: { soft: 'bg-pink-light text-pink-dark', solid: 'bg-pink-base' },
  red: { soft: 'bg-red-light text-red-dark', solid: 'bg-red-base' },
  orange: { soft: 'bg-orange-light text-orange-dark', solid: 'bg-orange-base' },
  yellow: { soft: 'bg-yellow-light text-yellow-dark', solid: 'bg-yellow-base' },
} as const

export type CategoryColor = keyof typeof CATEGORY_COLORS

export const categoryColor = (color: string) =>
  CATEGORY_COLORS[color as CategoryColor] ?? CATEGORY_COLORS.blue
