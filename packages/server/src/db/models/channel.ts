import { Schema } from 'mongoose'
import { toJSON, toObject } from './plugins'
import { required } from './utils'

export const ChannelSchema = new Schema({
  name: required(String),
  type: required(String),
  isPrivate: required(Boolean),
  profile: String,
  group: String,
}, { toJSON, toObject })
