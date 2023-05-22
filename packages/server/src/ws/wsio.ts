import { Server } from 'socket.io'
import { verify } from 'jsonwebtoken'
import type { Embed, Message, TokenPayload, User } from '@emcord/types'
import consola from 'consola'
import { Configuration, OpenAIApi } from 'openai'
import { getLinkPreview } from 'link-preview-js'
import { findUser } from '../router/modules/user'
import { setOnline } from '../router/modules/server'
import { editMsg, findChannel, sendMsg } from '../router/modules/channel'

const config = new Configuration({
  apiKey: process.env.API_KEY!,
})
const openai = new OpenAIApi(config)
const openaiPayload = {
  userId: '6423c1a9f1d3496feb9423a7',
  name: 'ChatGPT',
  avator: 'https://api.iconify.design/tabler:brand-openai.svg?color=%23ffffff',
}

const wss = new Server({
  cors: {
    origin: 'https://emcord.netlify.app',
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
      process.env.SECRET_KEY!,
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
        socket.emit('send-success', message, serverId)

        if (message.content?.includes('@ChatGPT') && message.content?.includes('/start')) {
          const rule = `你好，我是ChatGPT，可以和你聊天的机器人。我由OpenAI GPT-3.5驱动。我还在学习中，所以请对我有耐心。如果你有任何建议，请告诉我。
你可以通过回复这条消息开始和我聊天，在此期间，我仅会记住你最近的十条消息。
你也可以在任何频道中提及我并发送/start来开始新的对话。`
          const msg = await sendMsg({ type: 0, content: rule, referencedMessage: message.id }, channelId, openaiPayload)

          setTimeout(() => {
            socket.to(serverId).emit('message', msg)
            socket.emit('send-success', msg)
          }, 555)
        }
        if (message.referencedMessagePreview?.author.userId === '6423c1a9f1d3496feb9423a7') {
          const tenContexts = []
          let cur = message
          let i = 0
          while (cur && i < 10) {
            if (!cur.content)
              break
            const isFromUser = info.auth!.userId === cur.author.userId
            if (isFromUser)
              i++
            tenContexts.push({
              role: isFromUser ? 'user' : 'assistant' as any,
              content: cur.content!,
            })
            cur = cur.referencedMessagePreview
          }
          tenContexts.reverse()
          const { data } = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: tenContexts,
          })
          const reply = data.choices[0].message?.content
          if (reply) {
            const msg = await sendMsg({ type: 0, content: reply, referencedMessage: message.id }, channelId, openaiPayload)
            socket.to(serverId).emit('message', msg)
            socket.emit('send-success', msg)
          }
        }

        if (message.content?.includes('http')) {
          // @ts-expect-error NOT SUPPORTED
          const { id, content, mentions, reactions, attachments } = message as Message
          const embeds = await generateEmbeds(serverId, channelId, id, content)
          const r = await editMsg({
            type: 0,
            embeds,
            content,
            mentions,
            reactions,
            attachments,
          }, channelId, id, info.auth!)
          socket.emit('edit-success', r, serverId)
        }
      }
    }
    catch (e) {
      socket.emit('send-fail', e)
    }
  })

  socket.on('edit', async (msg, serverId, channelId, messageId) => {
    try {
      if (info.authed) {
        await findChannel(channelId, {
          premission: 'MEMBER',
          userId: info.auth!.userId,
        })
        const message = await editMsg(msg, channelId, messageId, info.auth!)
        socket.emit('edit-success', message, serverId)
      }
    }
    catch (e) {
      socket.emit('edit-fail', e)
    }
  })

  async function generateEmbeds(serverId: string, channelId: string, messageId: string, content: string) {
    const embeds: Embed[] = []
    const urls = content.match(/https?:\/\/[^\s]+/g)
    if (urls) {
      const rs = await Promise.all(urls.map(async url => {
        const { title = '', description = '', images = [''] } = await getLinkPreview(url) as any
        let img = images[0] as string

        return {
          title,
          description,
          link: url,
          image: img,
        }
      }))
      embeds.push(...rs)
    }
    return embeds
  }
})

wss.listen(3000)
