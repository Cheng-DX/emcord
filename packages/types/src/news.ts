export interface Auth {
  id: string
  userId: string
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  avator: string
  servers: string[]
  profile?: string
}

export type UserOverview = Omit<User, 'servers'>

export interface Channel {
  id: string
  name: string
  type: 'TEXT' | 'VOICE'
  isPrivate: boolean
  profile?: string
  group?: string
}

export interface Server {
  id: string
  name: string
  members: string[]
  owner: UserOverview
  channels: Channel[]
  avator?: string
  description?: string
}

interface EmojiReaction {
  emoji: {
    id: string
    name: string
  }
  count: number
  users: string[]
}
type AttachmentType = 'IMAGE' | 'VIDEO' | 'FILE'
interface Attachment {
  type: AttachmentType
  url: string
  filename: string
  width?: number
  height?: number
  size?: number
}
export type MessageType = 'NORMAL' | 'ATTACH' | 'LINK' | 'MARKDOWN'

export interface Message {
  id: string
  type: MessageType
  content: string
  channelId: string
  author: UserOverview
  reactions: EmojiReaction[]
  attachments: Attachment[]
  embeds: any[] // TODO: fix website infos
  mentions: UserOverview[]
  pinned: boolean
  mentionEveryone: boolean
  timestamp: Date
  edited: boolean
  refencedMessage?: Message
}
