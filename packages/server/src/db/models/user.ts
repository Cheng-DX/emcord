import { Schema, model } from 'mongoose'
import { toJSON, toObject } from './plugins'
import { required } from './utils'

export const UserOverViewSchemaSrc = {
  name: required(String),
  avator: required(String),
  profile: String,
}

const UserSchema = new Schema({
  name: required(String),
  avator: required(String),
  servers: required([String]),
  profile: String,
}, { toJSON, toObject })

export const UserModel = model(
  'UserModel',
  UserSchema,
  'USER',
)
