/**
 * Chaves centralizadas do TanStack Query.
 * Prefixo único evita colisão; filhos descrevem o recurso e parâmetros.
 */
export const queryKeys = {
  all: ['mf'] as const,

  user: {
    me: () => [...queryKeys.all, 'user', 'me'] as const,
  },

  categories: () => [...queryKeys.all, 'categories'] as const,

  subcategories: (categoryId: string) => [...queryKeys.all, 'subcategories', { categoryId }] as const,

  admin: {
    logs: (page: number, perPage: number) => [...queryKeys.all, 'admin', 'logs', { page, perPage }] as const,
  },

  expenses: {
    root: () => [...queryKeys.all, 'expenses'] as const,
    summary: (dateFrom: string, dateTo: string) =>
      [...queryKeys.expenses.root(), 'summary', { dateFrom, dateTo }] as const,
    /** Mesmos `date_from` / `date_to` do summary; `category_id` opcional (dropdown na home). */
    list: (
      page: number,
      perPage: number,
      filters: { date_from: string; date_to: string; category_id?: string },
    ) =>
      [
        ...queryKeys.expenses.root(),
        'list',
        {
          page,
          perPage,
          date_from: filters.date_from,
          date_to: filters.date_to,
          category_id: filters.category_id ?? '',
        },
      ] as const,
    detail: (id: string) => [...queryKeys.expenses.root(), 'detail', id] as const,
    /** Query desabilitada (sem id válido) — chave estável, sem fetch */
    detailNone: () => [...queryKeys.expenses.root(), 'detail', '__none__'] as const,
  },
} as const
