<script setup lang="ts">
import type { EmojiReaction, Message } from '@emcord/types'

const props = defineProps<{
  reaction: EmojiReaction
}>()

const emits = defineEmits<{
  (event: 'removeReaction', emoji: string): void
}>()

const { userInfo } = useUserInfo()
const message = inject<Message>('message')!
const hasMine = computed(() => props.reaction.users.includes(userInfo.value!.id))

async function clickReaction() {
  if (hasMine.value)
    emits('removeReaction', props.reaction.emoji.id)
}

const { params } = toRefs(useRoute())
async function addReaction(emoji: string) {
  const { id } = message
  const channelId = params.value.channelId as string
  const { data: msg } = await useFetch(
    `/api/channels/${channelId}/messages/${id}/reactions/${emoji}/@me`,
    { method: 'PUT' },
  )
    .json<Message>()

  if (!msg.value)
    return
  message.reactions.splice(0, message.reactions.length, ...msg.value.reactions)
}
</script>

<template>
  <div
    v-if="reaction.count > 0" flex justify-between items-center
    bgc-theme-2
    class="reaction-container"
    :style="{
      backgroundColor: hasMine ? '#4ba5f433' : '',
      borderColor: hasMine ? '#4ba5f466' : '',
    }"
    @click="clickReaction"
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
