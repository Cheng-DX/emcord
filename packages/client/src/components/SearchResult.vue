<script setup lang="ts">
import type { Message } from '@emcord/types'
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
  <div overflow-auto w-full>
    <MessageCard v-for="message in messages" :key="message.id" :message="message" />
  </div>
</template>

<style scoped>

</style>
