import type { Router } from 'express'
import type { Message, TokenPayload } from '@emcord/types'
import { CustomError, err, getAuth, isValidMessage, ok } from '../../utils'
import { ChannelModel, MessageModel } from '../../db/models'
import { findServer } from './server'

export async function formatMsg(
  msg: Partial<Message>,
  channelId: string,
  auth: TokenPayload,
) {
  const {
    type,
    content,
    reactions = [],
    attachments = [],
    embeds = [],
    mentions = [],
    pinned = false,
    mentionEveryone = false,
    edited = false,
    referencedMessage,
  } = msg
  if (msg.type === undefined || !msg.content)
    throw new CustomError('INVALID_REQUEST', 'Message needs field \'type\' and \'content\'')

  if (!isValidMessage(msg))
    throw new CustomError('INVALID_REQUEST', 'Your message is NOT valid')
  return {
    type,
    content,
    channelId,
    author: auth,

    timestamp: new Date(),
    reactions,
    attachments,
    embeds,
    mentions,
    pinned,
    mentionEveryone,
    edited,
    referencedMessage,
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
      const message = sendMag(msg, id, auth)
      ok(res, message)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.patch('/channels/:id/messages/:messageId', async (req, res) => {
    const { id, messageId } = req.params
    const auth = getAuth(req)
    const { content } = req.body
    try {
      await findChannel(id, {
        premission: 'MEMBER',
        userId: auth.userId,
      })

      const message = await MessageModel.findOneAndUpdate({
        'id': messageId,
        'author.userId': auth.userId,
      }, { content, edited: true }, { new: true })
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
