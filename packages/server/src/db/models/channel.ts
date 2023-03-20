import { Schema, model } from 'mongoose'
import { toJSON } from './plugins'
import { UserOverViewSchema } from './user'
import { required } from './utils'

export const ChannelModel = model(
  'ChannelModel',
  new Schema({
    name: required(String),
    usersOverview: required([UserOverViewSchema]),
    group: String,
    profileInfo: String,
  }, { toJSON }),
  'CHANNEL',
)
