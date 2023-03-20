import { Schema, model } from 'mongoose'
import { toJSON } from './plugins'
import { ServerSchema } from './server'
import { required } from './utils'

export const UserOverViewSchema = {
  name: required(String),
  avator: required(String),
  userId: required(String),
}

export const UserModel = model(
  'UserModel',
  new Schema({
    name: required(String),
    hashTag: required(String),
    avator: required(String),
    servers: required([ServerSchema]),
    gender: String,
    profileInfo: String,
  }, { toJSON }),
  'USER',
)
