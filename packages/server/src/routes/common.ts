import type { Request, Response, Router } from 'express'
import type { Model } from 'mongoose'
import { type Channel, ChannelModel, ServerModel, UserModel } from '../db/models'

interface PathModelMap {
  path: string
  model: Model<any>
  afterAdd?: (req: Request, res: Response, result: any) => Promise<void>
}

export function applyCommon(router: Router) {
  const models: PathModelMap[] = [
    { path: 'user', model: UserModel },
    { path: 'server', model: ServerModel },
    {
      path: 'channel',
      model: ChannelModel,
      afterAdd: async (req, _res, channel: Channel) => {
        if (req.body.serverId) {
          await ServerModel.findByIdAndUpdate(req.body.serverId, {
            $push: {
              channels: channel.id,
            },
          })
        }
      },
    },
  ]
  models.forEach(({ path, model, afterAdd }) => {
    router.get(`/${path}/:id`, async (req, res) => {
      const { id } = req.params
      try {
        const result = await model.findById(id)
        if (!result)
          throw new Error('Invaild id')
        res.status(200).json(result)
      }
      catch (e) {
        res.status(488).json({
          message: `[${path}]: Database query error : ${e}`,
        })
      }
    })

    router.post(`/${path}`, async (req, res) => {
      const content = req.body
      try {
        const result = await model.create(content)
        afterAdd && await afterAdd(req, res, result)
        res.status(200).json(result)
      }
      catch (e) {
        res.status(488).json({
          message: `[${path}]: Database add error: ${e}`,
        })
      }
    })

    router.patch(`/${path}/:id`, async (req, res) => {
      const { id } = req.params
      const content = req.body
      try {
        const result = await model.findByIdAndUpdate(id, content)
        res.status(200).json(result)
      }
      catch (e) {
        res.status(488).json({
          message: `[${path}]: Database update error: ${e}`,
        })
      }
    })
    router.delete(`/${path}/:id`, async (req, res) => {
      const { id } = req.params
      try {
        const result = await model.findByIdAndDelete(id)
        res.status(200).json(result)
      }
      catch (e) {
        res.status(488).json({
          message: `[${path}]: Database delete error: ${e}`,
        })
      }
    })
  })
}
