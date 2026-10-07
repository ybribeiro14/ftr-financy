const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatCurrency = (cents: number) => currency.format(cents / 100).replace(/ /g, ' ')

export const formatSignedCurrency = (cents: number, type: 'INCOME' | 'EXPENSE') =>
  `${type === 'INCOME' ? '+' : '-'} ${formatCurrency(cents)}`

export const formatAmountInput = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: '2-digit' })

export const dateToInput = (iso: string) => iso.slice(0, 10)

export const inputToApiDate = (value: string) => `${value}T12:00:00.000Z`

export const todayInput = () => new Date().toISOString().slice(0, 10)

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' })

export function monthOptions(count = 12) {
  const now = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1))
    const name = monthName.format(d)
    const year = d.getUTCFullYear()
    return {
      value: `${year}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`,
      label: `${name[0].toUpperCase()}${name.slice(1)} / ${year}`,
    }
  })
}
