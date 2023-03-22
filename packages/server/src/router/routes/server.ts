import type { Router } from 'express'
import type { ServerPreview } from '@emcord/types'
import { CustomError, err, getAuth, isValidChannelType, ok } from '../../utils'
import { ChannelModel, ServerModel, UserModel } from '../../db/models'
import { findUser } from './user'

async function getServerPreview(id: string, query?: {
  memberLimit?: number
  channelLimit?: number
}) {
  const { memberLimit = 1, channelLimit = 1 } = query || {}
  const server = await findServer(id)
  const membersPreview: any = await UserModel
    .find({
      _id: { $in: server.members },
    })
    .limit(Number(memberLimit))
    .select('-servers')

  const channelsPreview: any = await ChannelModel
    .find({
      _id: { $in: server.channels },
    })
    .limit(Number(channelLimit))

  const serverPreview: ServerPreview = {
    ...server.toObject(),
    membersPreview,
    channelsPreview,
  }

  return serverPreview
}

async function findServer(id: string, options?: {
  premission?: boolean
  userId: string
}) {
  const { premission = false, userId = '' } = options || {}
  const server = await ServerModel.findById(id)
  if (!server)
    throw new CustomError('INVALID_IDENTITY')

  if (premission && server.owner._id !== userId)
    throw new CustomError('PERMISSION_DENIED')

  else
    return server as any
}

export function applyServer(router: Router) {
  router.post('/servers', async (req, res) => {
    const { userId } = getAuth(req)
    const { name, avator, description } = req.body
    try {
      const user = await findUser(userId)
      const server = await ServerModel.create({
        owner: user,
        avator,
        name,
        channels: [],
        description,
        members: [userId],
      })
      await UserModel.findByIdAndUpdate(userId, {
        $push: { servers: server.id },
      })
      ok(res, server)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/servers/:id', async (req, res) => {
    const { id } = req.params
    try {
      const server = await findServer(id)
      ok(res, server)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/servers/:id/preview', async (req, res) => {
    const { id } = req.params
    try {
      const serverPreview = await getServerPreview(id, req.query)
      ok(res, serverPreview)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.patch('/servers/:id', async (req, res) => {
    const { id } = req.params
    const { userId } = getAuth(req)
    const { name, avator, description } = req.body
    try {
      await findServer(id, {
        premission: true,
        userId,
      })
      const patchedServer = await ServerModel.findByIdAndUpdate(id, {
        name,
        avator,
        description,
      }, {
        new: true,
      })
      ok(res, patchedServer)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.delete('/servers/:id', async (req, res) => {
    const { id } = req.params
    const { userId } = getAuth(req)
    try {
      await findServer(id, {
        premission: true,
        userId,
      })
      const deletedServer = await ServerModel.findByIdAndRemove(id)
      ok(res, deletedServer)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}

export function applyServerChannels(router: Router) {
  router.get('/servers/:id/channels', async (req, res) => {
    const { id } = req.params
    const { limit = 1 } = req.query
    try {
      const server = await findServer(id)
      const channels: any = await ChannelModel
        .find({
          _id: { $in: server.channels },
        })
        .limit(Number(limit))
      ok(res, channels)
    }

    catch (e: any) {
      err(res, e)
    }
  })

  router.post('/servers/:id/channels', async (req, res) => {
    const { id } = req.params
    const { userId } = getAuth(req)
    const payload = req.body

    try {
      await findServer(id, {
        premission: true,
        userId,
      })
      const channel = await ChannelModel.create(payload)
      await ServerModel.findByIdAndUpdate(id, {
        $push: { channels: channel.id },
      })
      ok(res, channel)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.patch('/servers/:id/channels/:channelId', async (req, res) => {
    const { id, channelId } = req.params
    const { userId } = getAuth(req)
    const channelPayload = req.body
    try {
      const { type } = channelPayload
      if (type !== undefined && !isValidChannelType(type))
        throw new CustomError('INVALID_REQUEST')

      const server = await findServer(id, {
        premission: true,
        userId,
      })

      if (!server.channels.includes(channelId))
        throw new CustomError('INVALID_IDENTITY')

      const channel = await ChannelModel.findByIdAndUpdate(channelId, channelPayload, { new: true })
      ok(res, channel)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.delete('/servers/:id/channels/:channelId', async (req, res) => {
    const { id, channelId } = req.params
    const { userId } = getAuth(req)
    try {
      await findServer(id, {
        premission: true,
        userId,
      })

      const channel = await ServerModel.findByIdAndUpdate(id, {
        $pull: {
          channels: channelId,
        },
      }, {
        new: true,
      })
      ok(res, channel)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}

export function applyServerMembers(router: Router) {
  router.get('/servers/:id/members', async (req, res) => {
    const { id } = req.params
    const { limit = 1 } = req.query
    try {
      const server = await findServer(id)
      const members = await UserModel
        .find({
          _id: { $in: server.members },
        })
        .limit(Number(limit))
        .select('-servers')
      ok(res, members)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/servers/:id/members/search', async (req, res) => {
    const { id } = req.params
    const { query, limit = 1 } = req.query
    try {
      if (!query)
        throw new CustomError('INVALID_REQUEST')

      const server = await findServer(id)
      const members = await UserModel
        .find({
          _id: { $in: server.members },
          $where: `this.name.toLowerCase().includes('${query}')`,
        })
        .select('-servers')
        .limit(Number(limit))

      ok(res, members)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.put('/servers/:id/members/:userId', async (req, res) => {
    const { id, userId } = req.params
    const { userId: authUserId } = getAuth(req)
    try {
      const server = await findServer(id, {
        premission: true,
        userId: authUserId,
      })
      if (server.members.includes(userId)) {
        ok(res, server)
        return
      }

      await ServerModel.findByIdAndUpdate(id, {
        $push: {
          members: userId,
        },
      }, {
        new: true,
      })
      ok(res, getServerPreview(id, {
        memberLimit: Number.NaN,
      }))
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.delete('/servers/:id/members/:userId', async (req, res) => {
    const { id, userId } = req.params
    const { userId: authUserId } = getAuth(req)
    try {
      if (userId === authUserId)
        throw new CustomError('DENIED')
      await findServer(id, {
        premission: true,
        userId: authUserId,
      })
      const server = await ServerModel.findByIdAndUpdate(id, {
        $pull: {
          members: userId,
        },
      }, {
        new: true,
      })
      ok(res, server)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}