<script setup lang="ts">
import { NInput } from 'naive-ui'
import ChannelList from './ChannelList.vue'

const { params } = toRefs(useRoute())

const { connected, messages, sendText, socket } = useSocket()
const msg = ref('')

function send() {
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
      <ChannelList :server-id="params.serverId" />
    </aside>
    <main flex-1 scroll-y>
      <h3>
        {{ params }} :
        {{ connected }}
      </h3>
      <pre>{{ messages }}</pre>
      <div flex>
        <NInput v-model:value="msg" w-100px style="width: 200px" />
        <div btn-primary h-33px w-90px ml-10px @click="send()">
          Send
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>
