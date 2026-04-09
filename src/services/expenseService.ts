import { api } from '../api/client'
import type { ApiSuccess } from '../api/types'
import type {
  CreateExpensePayload,
  ExpenseDto,
  ExpenseListPayload,
  SpendingSummary,
} from '../api/expenseTypes'

export async function fetchSpendingSummary(): Promise<SpendingSummary> {
  const { data } = await api.get<ApiSuccess<SpendingSummary>>('/expenses/summary')
  return data.data
}

export async function fetchExpenses(page = 1, perPage = 15): Promise<ExpenseListPayload> {
  const { data } = await api.get<ApiSuccess<ExpenseListPayload>>('/expenses', {
    params: { page, per_page: perPage },
  })
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
