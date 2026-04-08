export type ApiSuccess<T> = {
  data: T
}

export type ApiErrorBody = {
  message: string
  errors: Record<string, string[]>
}
