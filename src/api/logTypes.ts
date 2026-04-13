import type { ExpenseListMeta } from './expenseTypes'

export type AdminLogRow = {
  id: string
  user_id?: string | null
  user_name?: string | null
  action?: string | null
  subject_type?: string | null
  subject_id?: string | null
  description?: string | null
  properties?: Record<string, unknown> | string | null
  ip_address?: string | null
  user_agent?: string | null
  created_at: string | null
}

export type AdminLogListPayload = {
  items: AdminLogRow[]
  meta: ExpenseListMeta
}
