import type { Router } from 'express'
import type { Message, TokenPayload } from '@emcord/types'
import { CustomError, err, getAuth, isValidMessage, ok } from '../../utils'
import { ChannelModel, MessageModel, UserModel } from '../../db/models'
import { findServer } from './server'

export async function formatMsg(
  msg: Partial<Message>,
  channelId: string,
  auth: TokenPayload,
) {
  const {
    type,
    content,
    attachments = [],
    embeds = [],
    referencedMessage,
  } = msg
  if (msg.type === undefined || !msg.content)
    throw new CustomError('INVALID_REQUEST', 'Message needs field \'type\' and \'content\'')

  if (referencedMessage) {
    const message = await MessageModel.findOne({
      id: referencedMessage,
      channelId,
    })
    if (!message)
      throw new CustomError('DENIED', 'You can\'t reference a message that doesn\'t exist in this channel')
  }

  if (!isValidMessage({ type, content, attachments, embeds, referencedMessage }))
    throw new CustomError('INVALID_REQUEST', 'Your message is NOT valid')

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
    referencedMessage: '',
  }
}

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

export async function sendMag(msg: Partial<Message>, channelId: string, auth: TokenPayload) {
  const formattedMsg = await formatMsg(msg, channelId, auth)
  const message = await MessageModel.create(formattedMsg)
  return message
}

export function applyChannelMessage(router: Router) {
  router.get('/channels/:id/messages', async (req, res) => {
    const { id } = req.params
    const { userId } = getAuth(req)
    const { limit = 1 } = req.query
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId,
      })
      const messages = await MessageModel
        .find({
          channelId: id,
        })
        .limit(Number(limit))
      ok(res, messages)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/channels/:id/messages/:messageId', async (req, res) => {
    const { id, messageId } = req.params
    const { userId } = getAuth(req)
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId,
      })
      const message = await MessageModel.findById(messageId)
      if (!message)
        throw new CustomError('INVALID_IDENTITY')
      ok(res, message)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.post('/channels/:id/messages', async (req, res) => {
    const { id } = req.params
    const auth = getAuth(req)
    const msg = req.body
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId: auth.userId,
      })
      const message = await sendMag(msg, id, auth)
      ok(res, message)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.patch('/channels/:id/messages/:messageId', async (req, res) => {
    const { id, messageId } = req.params
    const auth = getAuth(req)
    const msg = req.body
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId: auth.userId,
      })

      const {
        content,
        attachments,
        embeds,
        mentions,
        mentionEveryone,
      } = await formatMsg(msg, id, auth)

      const message = await MessageModel.findOneAndUpdate({
        'id': messageId,
        'author.userId': auth.userId,
      }, {
        content,
        attachments,
        embeds,
        mentions,
        mentionEveryone,
      }, { new: true })
      ok(res, message)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.delete('/channels/:id/messages/:messageId', async (req, res) => {
    const { id, messageId } = req.params
    const auth = getAuth(req)
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId: auth.userId,
      })

      const message = await MessageModel.findOneAndDelete({
        'id': messageId,
        'author.userId': auth.userId,
      }, { new: true })
      ok(res, message)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}

export function applyChannelPins(router: Router) {
  router.get('/channels/:id/pins', async (req, res) => {
    const { id } = req.params
    const { userId } = getAuth(req)
    const { limit = 1 } = req.query
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId,
      })
      const messages = await MessageModel
        .find({
          channelId: id,
          pinned: true,
        })
        .limit(Number(limit))
      ok(res, messages)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.put('/channels/:id/pins/:messageId', async (req, res) => {
    const { id, messageId } = req.params
    const { userId } = getAuth(req)
    try {
      await findChannel(id, {
        premission: 'MANAGER',
        userId,
      })
      const messages = await MessageModel
        .findOneAndUpdate({
          id: messageId,
          channelId: id,
        }, { pinned: true }, { new: true })

      ok(res, messages)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.delete('/channels/:id/pins/:messageId', async (req, res) => {
    const { id, messageId } = req.params
    const { userId } = getAuth(req)
    try {
      await findChannel(id, {
        premission: 'MANAGER',
        userId,
      })
      const messages = await MessageModel
        .findOneAndUpdate({
          id: messageId,
          channelId: id,
        }, { pinned: false }, { new: true })

      ok(res, messages)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}

export function applyChannelReactions(router: Router) {
  router.put('/channels/:id/messages/:messageId/reactions/:emoji/@me', async (req, res) => {
    const { id, messageId, emoji } = req.params
    const { userId } = getAuth(req)
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId,
      })
      const message = await MessageModel.findById(messageId)
      if (!message)
        throw new CustomError('INVALID_IDENTITY')

      const reaction = message.reactions.find(r => r.emoji.id === emoji)
      let newMessage
      if (reaction) {
        if (!reaction.users.includes(userId)) {
          newMessage = await MessageModel.findByIdAndUpdate(messageId, {
            $inc: {
              'reactions.$.count': 1,
            },
            $push: {
              'reactions.$.users': userId,
            },
          }, { new: true })
        }
        else {
          throw new CustomError('DENIED', 'Already reacted with this emoji')
        }
      }
      else {
        const newReaction = {
          emoji: {
            id: emoji,
            name: emoji,
          },
          count: 1,
          users: [userId],
        }
        newMessage = await MessageModel.findByIdAndUpdate(messageId, {
          $push: {
            reactions: newReaction,
          },
        }, { new: true })
      }
      ok(res, newMessage)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.delete('/channels/:id/messages/:messageId/reactions/:emoji/@me', async (req, res) => {
    const { id, messageId, emoji } = req.params
    const { userId } = getAuth(req)
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId,
      })
      const message = await MessageModel.findById(messageId)
      if (!message)
        throw new CustomError('INVALID_IDENTITY')

      const reaction = message.reactions.find(r => r.emoji.id === emoji)
      let newMessage
      if (reaction) {
        if (reaction.users.includes(userId)) {
          // find the message with emoji.name in its reactions array and then update its count and users
          newMessage = await MessageModel.findOneAndUpdate({
            'id': messageId,
            'reactions.emoji.id': emoji,
          }, {
            $inc: {
              'reactions.$.count': -1,
            },
            $pull: {
              'reactions.$.users': userId,
            },
          }, { new: true })
        }
        else {
          throw new CustomError('DENIED', 'Not reacted with this emoji')
        }
      }
      else {
        throw new CustomError('DENIED', 'Reaction not found')
      }
      ok(res, newMessage)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/channels/:id/messages/:messageId/reactions/:emoji', async (req, res) => {
    const { id, messageId, emoji } = req.params
    const { limit = 1 } = req.query

    try {
      const { userId } = getAuth(req)
      await findChannel(id, {
        premission: 'MEMBER',
        userId,
      })
      // find all users info who is in the reaction.users array
      const msg = await MessageModel.findOne({
        'id': messageId,
        'reactions.emoji.id': emoji,
      }, {
        'reactions.$': 1, // this will return only the reaction object with emoji.name
      })
      const usersId = msg?.reactions[0].users

      if (!usersId || usersId.length === 0)
        throw new CustomError('DENIED', 'No reaction with this emoji')

      const users = await UserModel.find({
        _id: {
          $in: usersId,
        },
      })
        .select('-servers')
        .limit(Number(limit))
      ok(res, users)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}
