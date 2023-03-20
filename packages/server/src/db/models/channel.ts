import { Schema, model } from 'mongoose'
import type { UserOverview } from './user'
import { UserOverViewSchema } from './user'
import { required } from './utils'

export interface Channel {
  id: string
  name: string
  usersOverview: UserOverview[]
  profileInfo?: string
  group?: string
}

export const ChannelModel = model(
  'ChannelModel',
  new Schema({
    name: required(String),
    usersOverview: required([UserOverViewSchema]),
    group: String,
    profileInfo: String,
  }),
  'CHANNEL',
)
