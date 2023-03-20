import { Schema, model } from 'mongoose'
import { toJSON } from './plugins'
import { required } from './utils'

export const ServerSchema = new Schema({
  name: required(String),
  owner: required({
    name: required(String),
  }),
  channels: required([String]),
  avator: String,
  profileInfo: String,
}, { toJSON })

export const ServerModel = model(
  'ServerModel',
  ServerSchema,
  'SERVER',
)
