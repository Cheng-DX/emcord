import { type Socket, io } from 'socket.io-client'
import consola from 'consola'
import type { Attachment, Embed, Message } from '@emcord/types'
import { getLinkPreview } from 'link-preview-js'

const URL = 'http://localhost:9527'

export function useSocket() {
  const [connected, toggle] = useToggle(false)
  const { token } = useToken()
  const { userId } = useUserInfo()
  const socket = ref<Socket>()
  const messages = ref<Message[]>([])
  const messageContainer = ref<HTMLDivElement>()

  function move() {
    nextTick(() => {
      messageContainer.value?.scrollTo({
        behavior: 'smooth',
        top: messageContainer.value.scrollHeight,
      })
    })
  }
  function addMessage(msg: Message) {
    messages.value.push(msg)
    move()
  }

  function replaceMessage(msg: Message) {
    const index = messages.value.findIndex((m) => m.id === msg.id)
    if (index >= 0) {
      messages.value.splice(index, 1, msg)
      move()
    }
  }

  watch(token, (newToken) => {
    if (!connected.value) {
      socket.value = io(URL)

      socket.value.on('connect', () => {
        toggle(true)
        consola.success('connected')
      })
      socket.value.on('disconnect', () => {
        toggle(false)
        consola.error('disconnected')
      })

      // boardcast
      socket.value.on('message', (message) => {
        addMessage(message)
      })
      // join
      socket.value.emit('join', newToken)

      // send
      socket.value.on('send-success', (message: Message, serverId: string) => {
        addMessage(message)
        // if (message.author.userId === userId.value && message.embeds.length === 0)
        // generateEmbeds(serverId, message.channelId, message.id, message.content)
      })
      socket.value.on('send-fail', (e) => {
        notification.error({
          content: e.message,
        })
      })

      // edit
      socket.value.on('edit-success', (message) => {
        replaceMessage(message)
      })
      socket.value.on('edit-fail', (e) => {
        notification.error({
          content: e.message,
        })
      })
    }
  }, { immediate: true })

  function sendText(serverId: string, channelId: string, content: string) {
    if (socket.value) {
      socket.value.emit(
        'send',
        { type: 0, content },
        serverId,
        channelId,
      )
    }
    else {
      consola.error('No socket')
    }
  }

  function sendAttach(serverId: string, channelId: string, files: Attachment[], content?: string) {
    if (socket.value) {
      socket.value.emit(
        'send',
        { type: 1, attachments: files, content },
        serverId,
        channelId,
      )
    }
    else {
      consola.error('No socket')
    }
  }

  function editMessage(serverId: string, channelId: string, messageId: string, msg: Partial<Message>) {
    if (socket.value) {
      socket.value.emit(
        'edit',
        msg,
        serverId,
        channelId,
        messageId,
      )
    }
    else {
      consola.error('No socket')
    }
  }

  async function generateEmbeds(serverId: string, channelId: string, messageId: string, content: string) {
    console.log('d')
    if (socket.value) {
      const embeds: Embed[] = []
      const urls = content.match(/https?:\/\/[^\s]+/g)
      console.log(urls)
      if (urls) {
        urls.forEach(async (url) => {
          const { title = '', description = '', images = [''] } = await getLinkPreview(url) as any
          embeds.push({
            title,
            description,
            link: url,
            image: images[0],
          })
        })
      }
      console.log(embeds)

      editMessage(serverId, channelId, messageId, {
        type: 0,
        embeds,
      })
    }
    else {
      consola.error('No socket')
    }
  }

  function removeAttachment(serverId: string, channelId: string, messageId: string, msg: Message, url: string) {
    editMessage(serverId, channelId, messageId, {
      type: 1,
      attachments: msg.attachments.filter((a) => a.url !== url),
    })
  }

  return {
    connected,
    socket,
    messages,
    messageContainer,

    sendText,
    sendAttach,
    editMessage,
    removeAttachment,
    generateEmbeds,
  }
}
