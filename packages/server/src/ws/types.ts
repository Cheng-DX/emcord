import type { UserOverview } from '../db/models'

export interface WSMessagePayload {
  token: string
  from: UserOverview
  content: string
  time: Date
  serverId: string
  channelId: string
}
