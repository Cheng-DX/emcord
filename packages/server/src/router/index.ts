import { Router } from 'express'
import {
  applyAuth,
  applyServer,
  applyServerChannels,
  applyUser,
} from './routes'
const router = Router()

applyAuth(router)
applyUser(router)
applyServer(router)
applyServerChannels(router)
// applyCommon(router)
// applyMessage(router)

router.all('/*', (_req, res) => {
  res.status(404).json({
    message: 'Wrong api',
  })
})

export {
  router,
}
