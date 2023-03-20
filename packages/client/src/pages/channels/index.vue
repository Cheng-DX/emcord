<script setup lang="ts">
import ChannelList from './ChannelList.vue'
import type { WSMessage } from '~/types/im'
import { isOK } from '~/types/im'

const { params } = toRefs(useRoute())
const { token } = useToken()
const { userInfo, userOverview } = useUserInfo()

const { data, send, status } = useWebSocket<string>(
  () => `ws://localhost:9527/api/ws/channel?token=${token.value}`,
)
const all = ref<any[]>([])
const history = useLocalStorage<WSMessage[]>(
  `history-${params.value.channelId}-${userInfo.value?._id}`,
  [],
  { mergeDefaults: true },
)
watch(data, message => {
  if (message) {
    const msg = JSON.parse(message) as WSMessage
    all.value.push(msg)
    if (isOK(msg))
      history.value.push(msg)
  }
}, {
  immediate: true,
})

const inputValue = ref('')
function submit() {
  send(JSON.stringify({
    from: userOverview.value,
    content: inputValue.value,
    time: new Date(),
    channelId: params.value.channelId,
    serverId: params.value.serverId,
  }))
}
</script>

<template>
  <div flex h-full>
    <aside w-240px h-full bgc-2b2d30>
      <ChannelList :server-id="params.serverId" :connected="status === 'OPEN'" />
    </aside>
    <div flex-col>
      <div>
        {{ params.channelId }} in {{ params.serverId }}
      </div>
      <input v-model="inputValue">
      <button btn @click="submit()">
        SEND
      </button>
      {{ status }}
      <div flex>
        <div wp-50>
          <pre v-for="(h, i) in history" :key="i">
            {{ h.data?.content }}
          </pre>
        </div>
        <div wp-50>
          <pre v-for="(h, i) in all" :key="i">
            {{ h.data?.content || h.message }}
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
