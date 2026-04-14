import { api } from '../api/client'
import type { ApiSuccess } from '../api/types'
import type {
  CreateExpensePayload,
  ExpenseDto,
  ExpenseListPayload,
  SpendingSummary,
  SpendingSummaryBySubcategory,
} from '../api/expenseTypes'
import { normalizeDateRange } from '../utils/dateRange'

export type ExpenseListFilters = {
  category_id?: string
  subcategory_id?: string
  date_from?: string
  date_to?: string
}

export async function fetchSpendingSummary(range: {
  date_from: string
  date_to: string
}): Promise<SpendingSummary> {
  const { date_from, date_to } = normalizeDateRange(range.date_from, range.date_to)
  const { data } = await api.get<ApiSuccess<SpendingSummary>>('/expenses/summary', {
    params: { date_from, date_to },
  })
  return data.data
}

export async function fetchSpendingSummaryBySubcategory(range: {
  date_from: string
  date_to: string
}): Promise<SpendingSummaryBySubcategory> {
  const { date_from, date_to } = normalizeDateRange(range.date_from, range.date_to)
  const { data } = await api.get<ApiSuccess<SpendingSummaryBySubcategory>>('/expenses/summary/by-subcategory', {
    params: { date_from, date_to },
  })
  return data.data
}

/**
 * GET /api/v1/expenses
 * Query: `page`, `per_page`, `date_from`, `date_to` (mesmo formato do summary), opcionais `category_id`, `subcategory_id`.
 */
export async function fetchExpenses(
  page = 1,
  perPage = 15,
  filters?: ExpenseListFilters,
): Promise<ExpenseListPayload> {
  const { date_from, date_to } =
    filters?.date_from && filters?.date_to
      ? normalizeDateRange(filters.date_from, filters.date_to)
      : { date_from: filters?.date_from, date_to: filters?.date_to }

  const params: Record<string, string | number> = { page, per_page: perPage }
  if (filters?.category_id) params.category_id = filters.category_id
  if (filters?.subcategory_id) params.subcategory_id = filters.subcategory_id
  if (date_from) params.date_from = date_from
  if (date_to) params.date_to = date_to

  const { data } = await api.get<ApiSuccess<ExpenseListPayload>>('/expenses', { params })
  return data.data
}

export async function fetchExpense(id: string): Promise<ExpenseDto> {
  const { data } = await api.get<ApiSuccess<ExpenseDto>>(`/expenses/${id}`)
  return data.data
}

export async function createExpense(payload: CreateExpensePayload): Promise<ExpenseDto> {
  const body = {
    category_id: payload.category_id,
    description: payload.description,
    value: payload.value,
    subcategory_id: payload.subcategory_id ?? null,
  }
  const { data } = await api.post<ApiSuccess<ExpenseDto>>('/expenses', body)
  return data.data
}
