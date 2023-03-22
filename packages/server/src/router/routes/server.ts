import type { Router } from 'express'
import type { Server, ServerPreview } from '@emcord/types'
import type { Document } from 'mongoose'
import { CustomError, err, getAuth, ok } from '../../utils'
import { ServerModel, UserModel } from '../../db/models'
import { findUser } from './user'

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
      const server = await findServer(id)
      const membersPreview: any = await UserModel
        .find({
          _id: { $in: server.members },
        })
        .select('-servers')

      const serverPreview: ServerPreview = {
        ...server.toObject(),
        membersPreview,
      }

      return ok(res, serverPreview)
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
    try {
      const server = await findServer(id)
      ok(res, server.channels)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.post('/servers/:id/channels', async (req, res) => {
    const { id } = req.params
    const { userId } = getAuth(req)
    const { name, description } = req.body
    try {
      const server = await findServer(id)
      if (!server.members.includes(userId))
        throw new CustomError('PERMISSION_DENIED')

      const channel = await ServerModel.findByIdAndUpdate(id, {
        $push: {
          channels: {
            name,
            description,
            messages: [],
          },
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

  router.patch('/servers/:id/channels/:channelId', async (req, res) => {
    const { id, channelId } = req.params
    const { userId } = getAuth(req)
    const { name, description } = req.body
    try {
      const server = await findServer(id)
      if (!server.members.includes(userId))
        throw new CustomError('PERMISSION_DENIED')

      const channel = await ServerModel.findByIdAndUpdate(id, {
        $set: {
          [`channels.${channelId}`]: {
            name,
            description,
          },
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

  router.delete('/servers/:id/channels/:channelId', async (req, res) => {
    const { id, channelId } = req.params
    const { userId } = getAuth(req)
    try {
      const server = await findServer(id)
      if (!server.members.includes(userId))
        throw new CustomError('PERMISSION_DENIED')

      const channel = await ServerModel.findByIdAndUpdate(id, {
        $pull: {
          channels: {
            _id: channelId,
          },
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
