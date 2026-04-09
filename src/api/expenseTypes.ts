export type ExpenseDto = {
  id: string
  user_id?: string
  category_name: string
  subcategory_name: string | null
  description: string | null
  value: string
  created_at: string | null
  updated_at: string | null
}

export type CategoryTotal = {
  category_id: string
  category_name: string
  total: string
}

export type SpendingSummary = {
  total: string
  by_category: CategoryTotal[]
}

export type ExpenseListMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
  next_page_url: string | null
  prev_page_url: string | null
}

export type ExpenseListPayload = {
  items: ExpenseDto[]
  meta: ExpenseListMeta
}

export type CreateExpensePayload = {
  category_id: string
  subcategory_id?: string | null
  description: string
  value: number
}
