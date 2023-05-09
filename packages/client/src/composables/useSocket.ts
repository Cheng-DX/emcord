import { type Socket, io } from 'socket.io-client'
import consola from 'consola'
import type { Attachment, Message } from '@emcord/types'

const URL = 'http://localhost:9527'

export function useSocket() {
  const [connected, toggle] = useToggle(false)
  const { token } = useToken()
  const socket = ref<Socket>()
  const messages = ref<Message[]>([])
  const messageContainer = ref<HTMLDivElement>()

  function addMessage(msg: Message) {
    messages.value.push(msg)
    nextTick(() => {
      messageContainer.value?.scrollTo({
        behavior: 'smooth',
        top: messageContainer.value.scrollHeight,
      })
    })
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
      socket.value.on('send-success', (message) => {
        addMessage(message)
      })
      socket.value.on('send-fail', (e) => {
        notification.error({
          content: e.message,
        })
      })

      // edit
      socket.value.on('edit-success', (message) => {
        const index = messages.value.findIndex((m) => m.id === message.id)
        if (index >= 0)
          messages.value.splice(index, 1, message)
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
  }
}
