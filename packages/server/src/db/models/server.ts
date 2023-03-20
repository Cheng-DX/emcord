import { Schema, model } from 'mongoose'
import { required } from './utils'

export interface Server {
  id: string
  name: string
  owner: {
    id: string
    name: string
  }
  channels: string[]
  avator?: string
  profileInfo?: string
}

export const ServerSchema = new Schema({
  name: required(String),
  owner: required({
    name: required(String),
  }),
  channels: required([String]),
  avator: String,
  profileInfo: String,
})

export const ServerModel = model(
  'ServerModel',
  ServerSchema,
  'SERVER',
)
