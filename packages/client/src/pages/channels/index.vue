<script setup lang="ts">
import { NInput, useMessage } from 'naive-ui'
import type { Message } from '@emcord/types'
import ChannelList from './ChannelList.vue'
import MessageCard from '~/components/MessageCard.vue'

const { params } = toRefs(useRoute())
const { connected, messages, sendText } = useSocket()
const msg = ref('')

const message = useMessage()

const { data } = useFetch(
  () => `/api/channels/${params.value.channelId}/messages?limit=10`, {
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
}
</script>

<template>
  <div flex flex-row h-full>
    <aside w-240px>
      <ChannelList :server-id="params.serverId as string" />
    </aside>
    <main flex-1 scroll-y>
      <header h-30px p-3 flex items-center justify-between class="the-header">
        <div flex items-center>
          <strong>
            {{ params.channel }}
          </strong>
        </div>
        <div
          cursor-pointer
          i-ic-baseline-keyboard-arrow-down
          s-25px
        />
      </header>
      <div>
        <h3>
          {{ params }} :
          {{ connected }}
        </h3>
        <MessageCard
          v-for="message in messages"
          :key="message.id"
          :message="message"
        />
        <div flex>
          <NInput v-model:value="msg" w-100px style="width: 200px" />
          <div btn-primary h-33px w-90px ml-10px @click="send()">
            Send
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.the-header {
  border-bottom-color: rgba(26, 23, 23, 0.638);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 12px 16px;
  font-size: 16px;
}
</style>
