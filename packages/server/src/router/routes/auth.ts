import type { Router } from 'express'
import JWT from 'jsonwebtoken'
import sha256 from 'crypto-js/sha256'
import type { User } from '@emcord/types'
import { secretKey } from '../../consts'
import { AuthModel, UserModel } from '../../db/models'
import { CustomError, err, ok } from '../../utils'

export function applyAuth(router: Router) {
  router.post('/login', async (req, res) => {
    const { email, password, expiresIn = '30d' } = req.body
    try {
      const userAuth = await AuthModel.findOne({ email, password })
      if (!userAuth) { throw new CustomError('INVALID_USER') }

      else {
        const { userId } = userAuth
        const user = await UserModel.findById(userId)

        if (!user)
          throw new CustomError('INVALID_USER')

        const token = JWT.sign(
          {
            userId,
            name: user.name,
            avator: user.avator,
            profile: user.profile,
          },
          secretKey,
          { expiresIn },
        )
        ok(res, {
          message: 'Login success',
          token,
          user,
        })
      }
    }
    catch (e: any) {
      err(res, e)
    }
  })

  router.post('/register', async (req, res) => {
    const { email, password, user: userPayload } = req.body as { email: string; password: string; user: User }

    const hashedEmail = sha256(email).toString()
    const hashedPassword = sha256(password).toString()
    try {
      const theOne = await AuthModel.findOne({ email: hashedEmail })
      if (!theOne) {
        const user = await UserModel.create(userPayload)
        await AuthModel.create({
          userId: user.id,
          email: hashedEmail,
          password: hashedPassword,
        })
        ok(res, 'Registered successfully')
      }
      else {
        res.status(488).json({
          message: 'This email has been registered',
        })
      }
    }
    catch (e: any) {
      err(res, e)
    }
  })
}
