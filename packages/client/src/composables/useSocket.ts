import { type Socket, io } from 'socket.io-client'
import consola from 'consola'
import type { Message } from '@emcord/types'
import type { Ref } from 'vue'

const URL = 'http://localhost:9527'

export function useSocket(messageContainer: Ref<HTMLDivElement | undefined>) {
  const [connected, toggle] = useToggle(false)
  const { token } = useToken()
  const socket = ref<Socket>()
  const messages = ref<Message[]>([])

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

      socket.value.on('send-success', (message) => {
        addMessage(message)
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

  return {
    connected,
    socket,
    messages,

    sendText,
  }
}
