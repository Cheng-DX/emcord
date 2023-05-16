<script setup lang="ts">
import type { Message } from '@emcord/types'
import { NEmpty } from 'naive-ui'
import MessageCard from './message/MessageCard.vue'

const props = defineProps<{
  query: string
}>()
const messages = ref<Message[]>([])
const route = useRoute()
const channelId = computed(() => route.params.channelId as string)
async function search() {
  const { data: msgs } = await useFetch(`/api/channels/${channelId.value}/messages/search`)
    .post({
      query: props.query,
      limit: 10,
    })
    .json<Message[]>()
  messages.value = msgs.value!
}

defineExpose<{ search: () => void }>({
  search,
})
</script>

<template>
  <div v-if="messages.length > 0" overflow-auto w-full>
    <MessageCard v-for="message in messages" :key="message.id" :message="message" />
  </div>
  <NEmpty v-else w-full h-full flex-center description="没有符合预期的消息" />
</template>

<style scoped>

</style>
