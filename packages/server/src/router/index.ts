import { Router } from 'express'
import {
  applyAuth,
  applyChannelMessage,
  applyChannelPins,
  applyChannelReactions,
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
applyChannelMessage(router)
applyChannelPins(router)
applyChannelReactions(router)

router.all('/*', (_req, res) => {
  res.status(404).json({
    message: 'Opps, this path does not exist',
  })
})

export {
  router,
}
