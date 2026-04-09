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

  expenses: {
    root: () => [...queryKeys.all, 'expenses'] as const,
    summary: () => [...queryKeys.expenses.root(), 'summary'] as const,
    list: (page: number, perPage: number) =>
      [...queryKeys.expenses.root(), 'list', { page, perPage }] as const,
    detail: (id: string) => [...queryKeys.expenses.root(), 'detail', id] as const,
    /** Query desabilitada (sem id válido) — chave estável, sem fetch */
    detailNone: () => [...queryKeys.expenses.root(), 'detail', '__none__'] as const,
  },
} as const
