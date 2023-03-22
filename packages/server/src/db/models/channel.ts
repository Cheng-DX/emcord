import { Schema, model } from 'mongoose'
import { toJSON, toObject } from './plugins'
import { required } from './utils'

export const ChannelSchema = new Schema({
  name: required(String),
  type: required(Number),
  isPrivate: required(Boolean),
  profile: String,
  group: String,
}, { toJSON, toObject })

export const ChannelModel = model('ChannelModel', ChannelSchema, 'CHANNEL')
