<script setup lang="ts">
// @ts-expect-error no dts file
import { EmojiPicker } from 'vue3-twemoji-picker-final'

defineProps<{
  modelValue: string
}>()
const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'firstSelect', value: string): void
}>()

let isFirst = true
function selectEmoji(event: any) {
  const emoji = event.i as string
  if (isFirst) {
    isFirst = false
    emits('firstSelect', emoji)
  }
  emits('update:modelValue', emoji)
}
</script>

<template>
  <div flex h-500px pb-20px r-12 w-400px text-5 bgc-theme-2 class="container">
    <EmojiPicker
      :options="{
        imgSrc: 'https://fastly.jsdelivr.net/gh/limin04551/vue3-twemoji-picker/public/img/',
        native: true,
        locals: 'zh_CN',
        hasGroupIcons: true,
        hasSearch: true,
        hasGroupNames: false,
        stickyGroupNames: false,
        hasSkinTones: false,
        recentRecords: true,
      }"
      @select="selectEmoji"
    />
  </div>
</template>

<style scoped>
.container {
  box-shadow: rgba(2,2,2,0.15)  0px 0px 0px 1px, rgba(0, 0, 0, 0.24) 0px 8px 16px 0px !important;
}
.container :deep(.emoji-header) {
  font-size: 14px;
}
.container :deep(.emoji-footer) {
  font-size: 14px;
}
</style>
