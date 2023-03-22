import type { Server, UserPreview } from './news'

export type ServerPreview = Omit<Server, 'members'> & {
  membersPreview: UserPreview[]
}
