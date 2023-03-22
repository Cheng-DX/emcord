import type { Channel, Server, UserPreview } from './news'

export type ServerPreview = Server & {
  membersPreview: UserPreview[]
  channelsPreview: Channel[]
}

export interface Member {
  userId: string
  userPreview: UserPreview
  nickname?: string
}
