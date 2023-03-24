import type { Route } from './types'

export const server: Route[] = [
  // channel messages
  {
    path: '/channels/:id/messages',
    method: 'get',
  },
  {
    path: '/channels/:id/messages/:messageId',
    method: 'get',
  },
  {
    path: '/channels/:id/messages',
    method: 'post',
  },
  {
    path: '/channels/:id/messages/:messageId',
    method: 'patch',
  },
  {
    path: '/channels/:id/messages/:messageId',
    method: 'delete',
  },

  // Pins
  {
    path: '/channels/:id/pins',
    method: 'get',
    description: 'Get all pins in a channel',
  },
  {
    path: '/channels/:id/pins/:messageId',
    method: 'put',
  },
  {
    description: 'Unpin a message in a channel',
    path: '/channels/:id/pins/:messageId',
    method: 'delete',
  },

  // message reactions

  // own reactions
  {
    description: 'Add own reaction to a message',
    path: '/channels/:id/messages/:messageId/reactions/:emoji/@me',
    method: 'put',
  },
  {
    description: 'Remove own reaction from a message',
    path: '/channels/:id/messages/:messageId/reactions/:emoji/@me',
    method: 'delete',
  },
  // reaction list
  {
    description: 'Get a list of users that reacted with this emoji',
    path: '/channels/:id/messages/:messageId/reactions/:emoji',
    method: 'get',
  },

  // other reactions (requires manage permission)
  // {
  //   description: 'Remove a user\'s reaction from a message',
  //   path: '/channels/:id/messages/:messageId/reactions/:emoji/:userId',
  //   method: 'delete',
  // },
  // {
  //   description: 'Delete all reactions on a message',
  //   path: '/channels/:id/messages/:messageId/reactions',
  //   method: 'delete',
  // },
  // {
  //   description: 'Delete all reactions for a given emoji on a message',
  //   path: '/channels/:id/messages/:messageId/reactions/:emoji',
  //   method: 'delete',
  // },
]
