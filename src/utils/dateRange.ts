/** Data local em YYYY-MM-DD (para `<input type="date">` e query params). */
export function formatDateISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function endOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

export function currentMonthRange(): { date_from: string; date_to: string } {
  return {
    date_from: formatDateISO(startOfMonth()),
    date_to: formatDateISO(endOfMonth()),
  }
}

/** Garante `date_from` ≤ `date_to` antes de enviar à API. */
export function normalizeDateRange(date_from: string, date_to: string): { date_from: string; date_to: string } {
  if (date_from <= date_to) return { date_from, date_to }
  return { date_from: date_to, date_to: date_from }
}
