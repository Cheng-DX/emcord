import { WebSocket, WebSocketServer } from 'ws'
import { UserModel } from '../db/models'
import { createServerSetMap, createWSError, createWSOK, jsonParse, jsonStringfy, verifyToken } from './utils'
import type { WSMessagePayload } from './types'

export function initWSS(path: string, port: number) {
  const wss = new WebSocketServer({
    path,
    port,
  })

  const { serverSetMap, add, remove } = createServerSetMap()

  // wss.on('connection', async (ws, req) => {
  //   const params = new URL(`ws://localhost:9527${req.url!}`).searchParams
  //   const token = params.get('token')
  //   if (!token) {
  //     ws.send(createWSError(488, 'No token was not found'))
  //     ws.close()
  //     return
  //   }
  //   const [verified, userInfo] = verifyToken(token)
  //   if (!verified) {
  //     ws.send(createWSError(401, 'Unauthorized'))
  //     ws.close()
  //     return
  //   }
  //   const user = await UserModel.findById(userInfo.userId)
  //   if (!user) {
  //     ws.send(createWSError(488, 'WHO ARE YOU! GET OUT!'))
  //     ws.close()
  //     return
  //   }

  //   const { servers } = user
  //   servers.forEach(server => {
  //     add(server.id, ws)
  //   })

  //   ws.on('message', async (_data) => {
  //     const data = jsonParse<WSMessagePayload>(ws, _data)
  //     if (data && data.serverId && data.channelId) {
  //       const model = useMessageModel(data.channelId)
  //       try {
  //         const messageResult = await model.create(data)
  //         spread(data.serverId, ws, data)
  //         ws.send(createWSOK(messageResult))
  //       }
  //       catch (e) {
  //         ws.send(createWSError(488, `Database add error: ${e}`))
  //       }
  //     }
  //     else {
  //       ws.send(createWSError(488, 'Payload should has the matched channelId with your channel'))
  //     }
  //   })

  //   ws.on('close', () => {
  //     user.servers.forEach(server => remove(server.id, ws))
  //   })
  //   ws.on('error', console.error)
  // })

  // function spread(serverId: string, source: WebSocket, newMessage: WSMessagePayload) {
  //   serverSetMap.get(serverId)?.forEach(client => {
  //     if (source !== client && client.readyState === WebSocket.OPEN) {
  //       const msg = jsonStringfy(client, {
  //         code: 333,
  //         data: newMessage,
  //       })
  //       if (msg)
  //         client.send(msg)
  //     }
  //   })
  // }
}
