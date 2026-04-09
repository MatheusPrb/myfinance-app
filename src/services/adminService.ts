import { api } from '../api/client'
import type { ApiSuccess } from '../api/types'
import type { CategoryItem } from '../api/categoryTypes'

type SubcategoryCreated = {
  id: string
  name: string
  category_id: string
}

export async function createCategory(name: string): Promise<CategoryItem> {
  const { data } = await api.post<ApiSuccess<CategoryItem>>('/categories', { name })
  return data.data
}

export async function createSubcategory(categoryId: string, name: string): Promise<SubcategoryCreated> {
  const { data } = await api.post<ApiSuccess<SubcategoryCreated>>(
    `/categories/${categoryId}/subcategories`,
    { name },
  )
  return data.data
}
