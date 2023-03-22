type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'
export interface Route {
  path: string
  method: Method
  params?: Record<string, 'string' | 'number' | 'boolean' | 'date'>
  description?: string
}
