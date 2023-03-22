import type { Router } from 'express'
import { err, getAuth, ok } from '../../utils'
import { ServerModel, UserModel } from '../../db/models'
import { findUser } from './user'

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
        memebers: [userId],
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
}
