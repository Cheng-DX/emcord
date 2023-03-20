import type { Router } from 'express'
import { useMessageModel } from '../db/models/message'

export function applyMessage(router: Router) {
  router.post('/message', async (req, res) => {
    const content = req.body
    const { channelId } = content

    const model = useMessageModel(`MESSAGE-${channelId}`)
    try {
      const result = await model.create(content)
      res.status(200).json(result)
    }
    catch (e) {
      res.status(488).json({
        message: `[message]: Database add error: ${e}`,
      })
    }
  })

  router.get('/message/:channelId/:size', async (req, res) => {
    const { size, channelId } = req.params

    const model = useMessageModel(`MESSAGE-${channelId}`)

    try {
      const results = await model
        .find()
        .limit(Number(size))
        .sort({
          time: 'desc',
        })
      res.status(200).json(results)
    }
    catch (e) {
      res.status(488).json({
        message: `[message]: Database add error: ${e}`,
      })
    }
  })
}
