/**
 *   {
    path: '/users/:id',
    method: 'get',
  },
  {
    path: '/users/@me',
    method: 'get',
  },
  {
    path: '/users/@me',
    method: 'patch',
  },
  {
    path: '/users/@me/servers',
    method: 'get',
  },
  {
    path: '/users/@me/channels',
    method: 'post',
  },
 */
import type { User } from '@emcord/types'
import type { Router } from 'express'
import { ServerModel, UserModel } from '../../db/models'
import { CustomError, err, getAuth, ok } from '../../utils'

export async function findUser(id: string) {
  const result = await UserModel.findById(id)
  if (!result)
    throw new CustomError('INVALID_USER')
  else
    return result
}

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
    const user = req.body
    try {
      await UserModel.findByIdAndUpdate(userId, user as User)
      const patchedUser = await findUser(userId)
      ok(res, patchedUser)
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.get('/users/@me/servers', async (req, res) => {
    const { userId } = getAuth(req)
    try {
      const { servers } = await findUser(userId)
      const serverList = await ServerModel.find({
        _id: {
          $in: servers,
        },
      })

      ok(res, serverList)
    }
    catch (e: any) {
      err(res, e)
    }
  })
}

