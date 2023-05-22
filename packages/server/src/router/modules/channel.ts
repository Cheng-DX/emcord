import type { Message, ReferencedMessagePreview, TokenPayload } from '@emcord/types'
import { CustomError, isValidMessage } from '../../utils'
import { ChannelModel, MessageModel, UserModel } from '../../db/models'
import { findServer } from './server'

export async function findChannel(id: string, options?: {
  premission?: 'OWNER' | 'MEMBER' | 'MANAGER'
  userId: string
}) {
  const { premission = false, userId = '' } = options || {}

  const channel = await ChannelModel.findById(id)
  if (!channel)
    throw new CustomError('INVALID_IDENTITY')
  const server = await findServer(channel.serverId)

  if (premission === 'MEMBER' && !server.members.includes(userId))
    throw new CustomError('PERMISSION_DENIED', 'You need a MEMBER permission to send a message in this channel')

  if (premission === 'OWNER' && server.owner._id !== userId)
    throw new CustomError('PERMISSION_DENIED', 'You need an OWNER permission to send a message in this channel')

  // TODO: MANAGER should use a different permission system
  if (premission === 'MANAGER' && server.owner._id !== userId)
    throw new CustomError('PERMISSION_DENIED', 'You need an OWNER permission to send a message in this channel')

  return {
    channel,
    server,
  }
}

export async function formatMsg(
  msg: Partial<Message>,
  channelId: string,
  auth: TokenPayload,
) {
  const {
    type,
    content = '',
    attachments = [],
    embeds = [],
    referencedMessage,
  } = msg
  // if (msg.type === undefined || !msg.content)
  //   throw new CustomError('INVALID_REQUEST', 'Message needs field \'type\' and \'content\'')

  if (!isValidMessage({ type, content, attachments, embeds, referencedMessage }))
    throw new CustomError('INVALID_REQUEST', 'Your message is NOT valid')

  let referencedMessagePreview: ReferencedMessagePreview | undefined
  if (referencedMessage) {
    const message = await MessageModel.findOne({
      _id: referencedMessage,
      channelId,
    })
    if (!message) { throw new CustomError('DENIED', 'You can\'t reference a message that doesn\'t exist in this channel') }
    else {
      referencedMessagePreview = {
        author: message.author as any,
        content: message.content as any,
        referencedMessage: message.referencedMessage,
        referencedMessagePreview: message.referencedMessagePreview,
        attachments: message.attachments as any,
      }
    }
  }

  // parse mentions
  const mentions = content!.match(/<@(\w+)>/g)
  const mentionedUsers = Array.from(
    new Set(mentions?.map((mention) => mention.replace(/<@/, '').replace('>', '')) || []),
  )
  const mentionedUsersPreview = await UserModel
    .find({
      _id: {
        $in: mentionedUsers,
      },
    })
    .select('-servers')
  const mentionEveryone = content!.includes('@everyone')

  // const renderedContent = renderer.render(content!)

  return {
    type,
    content,
    channelId,
    author: auth,

    timestamp: new Date(),
    reactions: [],
    attachments,
    embeds,
    mentions: mentionedUsersPreview,
    pinned: false,
    mentionEveryone,
    edited: false,
    referencedMessage,
    referencedMessagePreview,
  }
}

export async function sendMsg(msg: Partial<Message>, channelId: string, auth: TokenPayload) {
  const formattedMsg = await formatMsg(msg, channelId, auth)
  const message = await MessageModel.create(formattedMsg)
  return message
}

export async function editMsg(msg: Partial<Message>, channelId: string, messageId: string, auth: TokenPayload) {
  const {
    content,
    attachments,
    embeds,
    mentions,
    mentionEveryone,
  } = await formatMsg(msg, channelId, auth)

  const _ = await MessageModel.findById({
    _id: messageId,
  })
  if (!_)
    throw new CustomError('INVALID_IDENTITY')
  if (_.author.userId !== auth.userId)
    throw new CustomError('PERMISSION_DENIED')

  const message = await MessageModel.findByIdAndUpdate(messageId, {
    content,
    attachments,
    embeds,
    mentions,
    mentionEveryone,
  }, { new: true })

  if (!message)
    throw new CustomError('PERMISSION_DENIED')

  return message
}
