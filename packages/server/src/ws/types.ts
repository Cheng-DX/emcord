import type { UserPreview } from '@emcord/types'

export interface WSMessagePayload {
  token: string
  from: UserPreview
  content: string
  time: Date
  serverId: string
  channelId: string
}
