import { type Socket, io } from 'socket.io-client'
import consola from 'consola'

const URL = 'http://localhost:9527'

export function useSocket() {
  const [connected, toggle] = useToggle(false)
  const { token } = useToken()
  const socket = ref<Socket>()
  const messages = ref<any[]>([])

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
        messages.value.push(message)
      })

      // join
      socket.value.emit('join', newToken)

      socket.value.on('send-success', (message) => {
        messages.value.push(message)
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
