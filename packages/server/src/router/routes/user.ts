import type { Router } from 'express'
import { ServerModel, UserModel } from '../../db/models'
import { CustomError, err, getAuth, ok } from '../../utils'
import { findUser } from '../modules/user'

export function applyUser(router: Router) {
  router.get('/users/@me', async (req, res) => {
    const { userId } = getAuth(req)
    try {
      const user = await findUser(userId)
      ok(res, user)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/users/:id', async (req, res) => {
    const { id } = req.params
    try {
      const user = await findUser(id)
      ok(res, user)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.patch('/users/@me', async (req, res) => {
    const { userId } = getAuth(req)
    const { name, avator, profile } = req.body
    try {
      const patchedUser = await UserModel.findByIdAndUpdate(
        userId, { name, avator, profile }, { new: true },
      )
      if (!patchedUser)
        throw new CustomError('INVALID_USER')

      ok(res, patchedUser)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/users/@me/servers', async (req, res) => {
    const { limit = 1 } = req.query
    const { userId } = getAuth(req)
    try {
      const { servers } = await findUser(userId)
      const serverList = await ServerModel
        .find({
          _id: {
            $in: servers,
          },
        })
        .limit(Number(limit))
      ok(res, serverList)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}

