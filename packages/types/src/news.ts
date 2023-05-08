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

export type UserPreview = Omit<User, 'servers'>

export interface Channel {
  id: string
  name: string
  type: 0 | // text
  1 // voice
  isPrivate: boolean
  profile?: string
  group?: string
}

export interface Server {
  id: string
  name: string
  members: string[]
  owner: UserPreview
  channels: string[]
  avator?: string
  description?: string
}

export interface EmojiReaction {
  emoji: {
    id: string
    name: string
  }
  count: number
  users: string[]
}
export type AttachmentType = 0 | 1 | 2
// 'IMAGE' | 'VIDEO' | 'RAW'
export interface Attachment {
  type: AttachmentType
  url: string
  filename: string
  width?: number
  height?: number
  size?: number
}
export type MessageType = 0 | 1 | 2 | 3
// 'NORMAL' | 'ATTACH' | 'LINK' | 'MARKDOWN'

export interface Embed {
  link: string
  title: string
  description: string
  image?: string
}
export interface Message {
  id: string
  type: MessageType
  content: string
  channelId: string
  author: UserPreview
  reactions: EmojiReaction[]
  attachments: Attachment[]
  embeds: Embed[]
  mentions: UserPreview[]
  pinned: boolean
  mentionEveryone: boolean
  timestamp: Date
  edited: boolean
  referencedMessage?: string
}
