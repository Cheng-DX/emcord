<script setup lang="ts">
import type { Message } from '@emcord/types'

const props = defineProps<{
  message: Message
  showBar: boolean
}>()

const hasAttachments = computed(() => props.message.attachments.length > 0)
const attachmentsTitle = computed(() => {
  if (hasAttachments.value) {
    const { length } = props.message.attachments
    const name = props.message.attachments.slice(0, 2).map((a) => a.filename).join('、')
    if (length > 2)
      return `[${name}等${length}个附件]`

    return `[附件 ${name}]`
  }
  return ''
})
</script>

<template>
  <div flex items-end>
    <div v-if="showBar" class="refered-bar" />
    <slot name="prefix" />
    <div flex flex-1 h-20px ml-4px items-center gap-4px c-text-3 font-italic>
      <img :src="message.author.avator" s-16px r-16>
      <span font-400>{{ message.author.name }}</span>
      <div wp-80 class="line-text">
        {{ message.content || (hasAttachments ? attachmentsTitle : '') }}
      </div>
    </div>
    <slot name="suffix" />
  </div>
</template>

<style scoped>
.refered-bar {
  width: 30px;
  height: 10px;
  border-left: 2px solid #4d5056;
  border-top: 2px solid #4d5056;
  border-top-left-radius: 5px;
}

.line-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 16px;
  height: 17px;
}
</style>
