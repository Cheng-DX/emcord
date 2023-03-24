import type { Attachment, Embed, EmojiReaction, Message } from '@emcord/types'

export const errorMap = {
  INVALID_USER: 'has valid token but userid is invalid',
  DATABASE_ERROR: 'database query error',
  PERMISSION_DENIED: 'user has no permission to access this resource',
  UNAUTHORIZED: 'user has no token or token is invalid',
  INVALID_IDENTITY: 'user has valid token but identity is invalid',
  INVALID_REQUEST: 'some fields in request body is invalid',
  DENIED: 'action denied',
}

export type CustomErrorType = keyof typeof errorMap

export class CustomError extends Error {
  type: CustomErrorType
  help: string

  constructor(type: CustomErrorType, help = '') {
    super(errorMap[type])
    this.type = type
    this.help = help
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      help: this.help,
    }
  }
}

export function isValidChannelType(type: number) {
  return [0, 1].includes(type)
}

export function isValidAttachmentType(type: number) {
  return [0, 1, 2].includes(type)
}

export function isValidAttachment(attachment: Attachment) {
  const { type, url, filename, width, height, size } = attachment

  if (isValidAttachmentType(type)) {
    return url
        && filename
        && (typeof width === 'number' || typeof width === undefined)
        && (typeof height === 'number' || typeof height === undefined)
        && (typeof size === 'number' || typeof size === undefined)
  }
  else {
    return false
  }
}

export function isValidLink(link: string | undefined) {
  return typeof link === 'string' && link.startsWith('http')
}

export function isValidEmbed(embed: Embed) {
  const { title, description, image } = embed

  return title
      && description
      && (!image || isValidLink(image))
}

export function isValidMessage(msg: Partial<Message>) {
  if (msg.type === undefined || (![0, 1, 2, 3].includes(msg.type)))
    return false

  switch (msg.type) {
    case 0:
      // normal
      return !!msg.content
    case 1:
      // attach
      return Array.isArray(msg.attachments)
      && msg.attachments.length > 0
      && msg.attachments.every(isValidAttachment)
    case 2:
      // link
      return isValidLink(msg.content)
      && Array.isArray(msg.embeds)
      && msg.embeds.length > 0
      && msg.embeds.every(isValidEmbed)
    case 3:
      // markdown
      return !!msg.content
    default:
      return false
  }
}

export function isvalidReaction(reaction: Partial<EmojiReaction>) {
  return reaction.emoji
      && reaction.emoji.id
      && reaction.emoji.name
      && typeof reaction.count === 'number'
      && Array.isArray(reaction.users)
      && reaction.users.every((id) => typeof id === 'string')
}
