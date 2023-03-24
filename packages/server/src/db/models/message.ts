import { Schema, model } from 'mongoose'
import { toJSON, toObject } from './plugins'
import { UserPreviewSchemaSrc } from './user'
import { required } from './utils'

const ReactionSchemaSrc = {
  emoji: required({
    id: required(String),
    name: required(String),
  }),
  count: required(Number),
  users: required([String]),
}

const AttachmentSchemaSrc = {
  type: required(Number),
  url: required(String),
  filename: required(String),
  width: Number,
  height: Number,
  size: Number,
}

const EmbedSchemaSrc = {
  link: required(String),
  title: required(String),
  description: required(String),
  image: String,
}

export const MessageSchemaSrc = {
  type: required(Number),
  content: required(String),
  channelId: required(String),
  author: required({
    userId: required(String),
    name: required(String),
    avator: required(String),
    profile: String,
  }),
  timestamp: required(Date),

  reactions: [ReactionSchemaSrc],
  attachments: [AttachmentSchemaSrc],
  embeds: [EmbedSchemaSrc],
  mentions: [UserPreviewSchemaSrc],
  pinned: Boolean,
  mentionEveryone: Boolean,
  edited: Boolean,
  referencedMessage: String,
}

export const MessageModel = model(
  'MessageModel',
  new Schema(MessageSchemaSrc, { toJSON, toObject }),
  'MESSAGE',
)
