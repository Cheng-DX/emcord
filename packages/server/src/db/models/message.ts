import type { Model } from 'mongoose'
import { Schema, model } from 'mongoose'
import { toJSON, toObject } from './plugins'
import { UserOverViewSchemaSrc } from './user'
import { required } from './utils'

const modelMap = new Map<string, Model<any>>()

const ReactionSchemaSrc = {
  emoji: {
    id: required(String),
    name: required(String),
  },
  count: required(Number),
  users: required([String]),
}

const AttachmentSchemaSrc = {
  type: required(String),
  url: required(String),
  filename: required(String),
  width: Number,
  height: Number,
  size: Number,
}

export const MessageSchemaSrc = {
  type: required(String),
  content: required(String),
  channelId: required(String),
  author: required(UserOverViewSchemaSrc),
  reactions: required([ReactionSchemaSrc]),
  attachments: required([AttachmentSchemaSrc]),
  embeds: required([Object]),
  mentions: required([UserOverViewSchemaSrc]),
  pinned: required(Boolean),
  mentionEveryone: required(Boolean),
  timestamp: required(Date),
  edited: required(Boolean),
  refencedMessage: {},
}
MessageSchemaSrc.refencedMessage = MessageSchemaSrc

export function useMessageModel(channelId: string): Model<typeof MessageSchemaSrc> {
  const db = `MESSAGE-${channelId}`
  const mapedModel = modelMap.get(db)
  if (mapedModel) { return mapedModel }

  else {
    const createdModel = model<typeof MessageSchemaSrc>(
      db,
      new Schema(MessageSchemaSrc, { toJSON, toObject }),
      db,
    )
    modelMap.set(db, createdModel)
    return createdModel
  }
}
