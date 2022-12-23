export interface HttpResponse {
  code?: number
  data?: any
  message?: string
  type?: 'success' | 'error'
}
