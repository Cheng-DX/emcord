import { Router } from 'express'
import { applyAuth } from './auth'
import { applyCommon } from './common'
import { applyMessage } from './message'

const router = Router()

applyCommon(router)
applyAuth(router)
applyMessage(router)

router.all('/*', (_req, res) => {
  res.status(404).json({
    message: 'Wrong api',
  })
})

export {
  router,
}
