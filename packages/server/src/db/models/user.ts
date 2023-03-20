import { Schema, model } from 'mongoose'
import type { Server } from './server'
import { ServerSchema } from './server'
import { required } from './utils'

export interface User {
  id: string
  name: string
  hashTag: string
  avator: string
  servers: Server[]
  gender?: string
  profileInfo?: string
}

export type UserOverview = Pick<User, 'name' | 'avator'> & { userId: string }
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
  }),
  'USER',
)
