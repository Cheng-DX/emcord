<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { Channel, Message, Server } from '@emcord/types'
import type { Ref } from 'vue'
import MessageCard from '~/components/MessageCard.vue'

const { params } = toRefs(useRoute())

const server = inject<Ref<Server>>('server')
const channels = inject<Ref<Channel[]>>('channels')

const channel = computed(() => {
  if (channels?.value) {
    return channels.value.find(
      (channel) => channel.id === params.value.channelId,
    )
  }
})

const { messages, sendText } = useSocket()
const msg = ref('')

const message = useMessage()
const { data } = useFetch(
  () => `/api/channels/${params.value.channelId}/messages?limit=100`, {
    refetch: true,
  },
).json<Message[]>()

watch(data, (n) => {
  if (n)
    messages.value = n.reverse()
})

function send() {
  message.success('Sent')
  if (msg.value) {
    sendText(
      params.value.serverId as string,
      params.value.channelId as string,
      msg.value,
    )
  }
  nextTick(() => {
    msg.value = ''
    window.scrollTo(0, document.body.scrollHeight)
  })
}
</script>

<template>
  <div flex-1>
    <header
      h-24px
      p-3
      flex
      items-center
      justify-between
      class="the-header"
    >
      <div flex items-center>
        <img
          src="https://api.iconify.design/octicon:hash-16.svg?color=%2380848e"
          draggable="false"
          s-22px
          mr-10px
        >
        <strong>
          {{ channel?.name }}
        </strong>
      </div>
    </header>
    <div
      scroll-y
      mt-48px
      mb-48px
      style="max-height: calc(100vh - 120px); width: calc(100vw - 240px - 72px)"
    >
      <MessageCard
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
    </div>
    <footer
      h-24px
      p-3
      flex
      items-center
      justify-between
      class="the-footer"
    >
      <input v-model="msg" h-30px wp-100>
      <div btn-primary h-33px w-90px ml-10px @click="send()">
        Send
      </div>
    </footer>
  </div>
</template>

<style scoped>
.the-header {
  border-bottom-color: rgba(26, 23, 23, 0.638);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 12px 16px;
  font-size: 16px;
  position: absolute;
  top: 0;
  right: 0;
  width: calc(100vw - 240px - 72px - 32px);
}
.the-footer {
  padding: 12px 16px;
  font-size: 16px;
  position: absolute;
  bottom: 0;
  right: 0;
  width: calc(100vw - 240px - 72px - 32px);
  margin-bottom: 24px;
}
</style>
