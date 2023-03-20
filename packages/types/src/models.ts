export interface Channel {
  id: string
  name: string
  usersOverview: UserOverview[]
  profileInfo?: string
  group?: string
}

export interface Auth {
  id: string
  userId: string
  email: string
  password: string
}

interface Reaction {
  emoji: string
  from: UserOverview
}

export interface Message {
  id: string
  from: UserOverview
  content: string
  time: Date
  reactions?: Reaction[]
  reply?: string
}

export interface Server {
  id: string
  name: string
  owner: {
    id: string
    name: string
  }
  channels: string[]
  avator?: string
  profileInfo?: string
}

export interface User {
  id: string
  name: string
  hashTag: string
  avator: string
  servers: Server[]
  gender?: string
  profileInfo?: string
}

export type UserOverview = Pick<User, 'name' | 'avator'> & { userId: string }
