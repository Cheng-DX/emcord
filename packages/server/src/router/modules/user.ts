import type { Route } from './types'

// done
export const users: Route[] = [
  {
    path: '/users/:id',
    method: 'get',
  },
  {
    path: '/users/@me',
    method: 'get',
  },
  {
    path: '/users/@me',
    method: 'patch',
  },
  {
    path: '/users/@me/servers',
    method: 'get',
  },
]
