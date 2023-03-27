import { Server } from 'socket.io'
import { verify } from 'jsonwebtoken'
import type { TokenPayload, User } from '@emcord/types'
import consola from 'consola'
import { secretKey } from '../consts'
import { findUser } from '../router/modules/user'
import { setOnline } from '../router/modules/server'
import { findChannel, sendMsg } from '../router/modules/channel'

const wss = new Server({
  cors: {
    origin: 'http://localhost:5173',
  },
})

export const onlineUsers = new Set<string>()

function useAuth() {
  const info = {
    authed: false,
    user: undefined,
    auth: undefined,
  } as {
    authed: boolean
    user: User | undefined
    auth: TokenPayload | undefined
  }

  async function verifyAuth(token: string) {
    if (info.authed)
      return

    info.auth = verify(
      token,
      secretKey,
    ) as TokenPayload
    info.user = await findUser(info.auth.userId) as any
    info.authed = true
    setOnline(info.auth.userId)
  }

  return {
    info,
    verifyAuth,
  }
}

wss.on('connection', (socket) => {
  let { info, verifyAuth } = useAuth()

  socket.on('join', async (token) => {
    try {
      await verifyAuth(token)
      const { servers } = info.user!
      socket.join(servers)
      onlineUsers.add(info.user!.id)
      consola.success('join', servers, info.user!.name)
    }
    catch (e: any) {
      consola.success(e)
    }
  })

  socket.on('disconnect', () => {
    if (info.authed)
      onlineUsers.delete(info.auth!.userId)
  })

  socket.on('send', async (msg, serverId, channelId) => {
    try {
      if (info.authed) {
        await findChannel(channelId, {
          premission: 'MEMBER',
          userId: info.auth!.userId,
        })
        const message = await sendMsg(msg, channelId, info.auth!)
        socket.to(serverId).emit('message', message)
        socket.emit('send-success', message)
      }
    }
    catch (e) {
    }
  })
})

wss.listen(9527)
