import { Router } from 'express'
import {
  applyAuth,
  applyServer,
  applyServerChannels,
  applyServerMembers,
  applyUser,
} from './routes'
const router = Router()

applyAuth(router)
applyUser(router)
applyServer(router)
applyServerChannels(router)
applyServerMembers(router)

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
