import type { UserOverview } from './models'

export type WSMessage = WSMessageOK | WSMessageError

export interface MessageData {
  from: UserOverview
  content: string
  time: Date
  serverId: string
  channelId: string
  token: string
}

export interface WSMessageError {
  code: 401 | 500 | 388
  message: string
}

export interface WSMessageOK {
  code: 200
  data: MessageData
}

export function isError(wsm: WSMessage): wsm is WSMessageError {
  return wsm.code !== 200
}

export function isOK(wsm: WSMessage): wsm is WSMessageOK {
  return wsm.code === 200
}
