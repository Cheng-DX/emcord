import { Schema, model } from 'mongoose'
import { toJSON, toObject } from './plugins'
import { UserPreviewSchemaSrc } from './user'
import { required } from './utils'

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

export const MessagePreviewSrc = {
  type: required(String),
  author: required(UserPreviewSchemaSrc),
  content: required(String),
}

export const MessageSchemaSrc = {
  type: required(String),
  content: required(String),
  channelId: required(String),
  author: required(UserPreviewSchemaSrc),
  reactions: required([ReactionSchemaSrc]),
  attachments: required([AttachmentSchemaSrc]),
  embeds: required([Object]),
  mentions: required([UserPreviewSchemaSrc]),
  pinned: required(Boolean),
  mentionEveryone: required(Boolean),
  timestamp: required(Date),
  edited: required(Boolean),
  refencedMessage: MessagePreviewSrc,
}

export const MessageModel = model(
  'MessageModel',
  new Schema(MessageSchemaSrc, { toJSON, toObject }),
  'MESSAGE',
)
