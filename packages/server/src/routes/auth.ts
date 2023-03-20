import type { Router } from 'express'
import JWT from 'jsonwebtoken'
import sha256 from 'crypto-js/sha256'
import { secretKey } from '../consts'
import type { User } from '../db/models'
import { AuthModel, UserModel } from '../db/models'

export function applyAuth(router: Router) {
  router.post('/login', async (req, res) => {
    const { email, password, expiresIn = '24h' } = req.body
    try {
      const userAuth = await AuthModel.findOne({ email, password })
      if (!userAuth) {
        res.status(488).json({
          message: 'No such user or password is wrong',
        })
      }
      else {
        const { userId } = userAuth
        const user = await UserModel.findById(userId)

        if (!user) {
          res.status(488).json({
            message: 'No such user or password is wrong',
          })
          return
        }

        const token = JWT.sign(
          { userId },
          secretKey,
          { expiresIn },
        )
        res.status(200).json({
          message: 'Login success',
          token,
          user,
        })
      }
    }
    catch (e: any) {
      res.status(500).json({
        message: e.message,
      })
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
        res.status(200).json({
          message: 'success',
        })
      }
      else {
        res.status(488).json({
          message: 'This email has been registered',
        })
      }
    }
    catch (e) {
      res.status(500).json({
        message: e,
      })
    }
  })
}
