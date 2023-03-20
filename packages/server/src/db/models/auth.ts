import { Schema, model } from 'mongoose'
import { toJSON } from './plugins'
import { required } from './utils'

export const AuthModel = model(
  'AuthModel',
  new Schema({
    userId: required(String),
    email: required(String),
    password: required(String),
  }, { toJSON }),
  'AUTH',
)
