import type { Model } from 'mongoose'
import { Schema, model } from 'mongoose'
import type { Message } from '@emcord/types'
import { toJSON } from './plugins'
import { UserOverViewSchema } from './user'
import { required } from './utils'

const modelMap = new Map<string, Model<any>>()

export function useMessageModel(channelId: string): Model<Message> {
  const db = `MESSAGE-${channelId}`
  const mapedModel = modelMap.get(db)
  if (mapedModel) {
    return mapedModel
  }
  else {
    const createdModel = model<Message>(
      db,
      new Schema({
        from: required(UserOverViewSchema),
        content: required(String),
        time: required(Date),
        reactions: [{
          emoji: required(String),
          from: required(UserOverViewSchema),
        }],
        reply: String,
      }, { toJSON }),
      db,
    )
    modelMap.set(db, createdModel)
    return createdModel
  }
}
