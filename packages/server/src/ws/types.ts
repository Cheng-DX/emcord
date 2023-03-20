import type { UserOverview } from '@emcord/types'

export interface WSMessagePayload {
  token: string
  from: UserOverview
  content: string
  time: Date
  serverId: string
  channelId: string
}
