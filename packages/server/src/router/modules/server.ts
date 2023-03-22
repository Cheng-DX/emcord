import type { Route } from './types'

export const server: Route[] = [
  // server
  {
    path: '/servers',
    method: 'post',
  },
  {
    path: '/servers/:id',
    method: 'get',
  },
  {
    path: '/servers/:id/preview',
    method: 'get',
    description: 'Get a preview of a server',
  },
  {
    path: '/servers/:id',
    method: 'patch',
  },
  {
    path: '/servers/:id',
    method: 'delete',
  },

  // server channels
  {
    path: '/servers/:id/channels',
    method: 'get',
  },
  {
    path: '/servers/:id/channels',
    method: 'post',
  },
  {
    path: '/servers/:id/channels/:channelId',
    method: 'patch',
  },
  {
    path: '/servers/:id/channels/:channelId',
    method: 'delete',
  },

  // server members
  {
    path: '/servers/:id/members',
    method: 'get',
  },
  {
    path: '/servers/:id/members/search',
    method: 'get',
  },
  {
    description: 'Add a user to a server',
    path: '/servers/:id/members/:userId',
    method: 'put',
  },
  {
    path: '/servers/:id/members/:userId',
    method: 'delete',
  },
  {
    description: 'Update current user',
    path: '/servers/:id/members/@me',
    method: 'patch',
  },
  {
    path: '/servers/:id/members/:userId',
    method: 'patch',
  },

  // TODO: roles
]
