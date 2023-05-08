import { Server } from 'socket.io'
import { verify } from 'jsonwebtoken'
import type { TokenPayload, User } from '@emcord/types'
import consola from 'consola'
import { Configuration, OpenAIApi } from 'openai'
import { secretKey } from '../consts'
import { findUser } from '../router/modules/user'
import { setOnline } from '../router/modules/server'
import { findChannel, sendMsg } from '../router/modules/channel'
import { arcKey } from '../../__apiKey__'

const config = new Configuration({
  apiKey: arcKey,
})
const openai = new OpenAIApi(config)
const openaiPayload = {
  userId: '6423c1a9f1d3496feb9423a7',
  name: 'ChatGPT',
  avator: 'https://api.iconify.design/tabler:brand-openai.svg?color=%23ffffff',
}

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

        if (message.content?.includes('@ChatGPT')) {
          const { data } = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{
              role: 'user',
              content: message.content,
            }],
          })
          const reply = data.choices[0].message?.content
          if (reply) {
            const msg = await sendMsg({ type: 0, content: reply }, channelId, openaiPayload)
            socket.to(serverId).emit('message', msg)
            socket.emit('send-success', msg)
          }
        }
      }
    }
    catch (e) {
      socket.emit('send-fail', e)
    }
  })
})

wss.listen(9527)
