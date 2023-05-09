<script setup lang="ts">
import type { EmojiReaction, Message } from '@emcord/types'

const props = defineProps<{
  reaction: EmojiReaction
}>()

const { userInfo } = useUserInfo()

const message = inject<Message>('message')!
const hasMine = computed(() => props.reaction.users.includes(userInfo.value!.id))

async function clickReaction() {
  if (hasMine.value)
    removeReaction(props.reaction.emoji.id)
  else
    addReaction(props.reaction.emoji.id)
}

const { params } = toRefs(useRoute())
async function addReaction(emoji: string) {
  const { id } = message
  const channelId = params.value.channelId as string
  const msg = await useFetch(
    `/api/channels/${channelId}/messages/${id}/reactions/${emoji}/@me`,
  ).json<Message>()

  console.log(msg)
}

async function removeReaction(emoji: string) {
  const { id } = message
  const channelId = params.value.channelId as string
  const msg = await useFetch(
    `/api/channels/${channelId}/messages/${id}/reactions/${emoji}/@me`,
    { method: 'DELETE' },
  ).json<Message>()

  console.log(msg)
}
</script>

<template>
  <div
    flex justify-between items-center bgc-theme-2
    class="reaction-container"
    :style="{
      backgroundColor: hasMine ? '#4ba5f411' : '',
      borderColor: hasMine ? '#4ba5f466' : '',
    }"
  >
    <span>{{ reaction.emoji.id }}</span>
    <span>{{ reaction.count }}</span>
  </div>
</template>

<style scoped>
.reaction-container {
  width: 32px;
  height: 18px;
  overflow: hidden;
  border-radius: 8px;
  padding: 3px 6px;
  border: 1px solid transparent;
  cursor: pointer;
}
.reaction-container:hover {
  filter: opacity(0.9);
  border: 1px solid #ced3d661;
}
</style>
