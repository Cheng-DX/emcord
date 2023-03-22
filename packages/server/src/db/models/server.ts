import { Schema, model } from 'mongoose'
import { ChannelSchema } from './channel'
import { toJSON, toObject } from './plugins'
import { UserOverViewSchemaSrc } from './user'
import { required } from './utils'

export const ServerSchema = new Schema({
  name: required(String),
  owner: required(UserOverViewSchemaSrc),
  memebers: required([String]),
  channels: required([ChannelSchema]),

  avator: String,
  description: String,
}, { toJSON, toObject })

export const ServerModel = model(
  'ServerModel',
  ServerSchema,
  'SERVER',
)
