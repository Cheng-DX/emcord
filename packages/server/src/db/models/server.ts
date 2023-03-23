import { Schema, model } from 'mongoose'
import { toJSON, toObject } from './plugins'
import { UserPreviewSchemaSrc } from './user'
import { required } from './utils'

export const ServerSchema = new Schema({
  name: required(String),
  owner: required(UserPreviewSchemaSrc),
  members: required([String]),
  channels: required([String]),

  avator: String,
  description: String,
}, { toJSON, toObject })

export const ServerModel = model(
  'ServerModel',
  ServerSchema,
  'SERVER',
)
