import { api } from '../api/client'
import type { CategoryItem, SubcategoryItem } from '../api/categoryTypes'
import type { ApiSuccess } from '../api/types'

type ItemsWrapper<T> = { items: T[] }

export async function fetchCategories(): Promise<CategoryItem[]> {
  const { data } = await api.get<ApiSuccess<ItemsWrapper<CategoryItem>>>('/categories')
  return data.data.items ?? []
}

export async function fetchSubcategoriesByCategory(categoryId: string): Promise<SubcategoryItem[]> {
  const { data } = await api.get<ApiSuccess<ItemsWrapper<SubcategoryItem>>>(
    `/categories/${categoryId}/subcategories`,
  )
  return data.data.items ?? []
}
