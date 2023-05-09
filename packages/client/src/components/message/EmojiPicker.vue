<script setup lang="ts">
// @ts-expect-error no dts file
import { EmojiPicker } from 'vue3-twemoji-picker-final'

defineProps<{
  modelValue: string
}>()
const emits = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
function selectEmoji(event: any) {
  emits('update:modelValue', event.i)
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
        hasSkinTones: true,
        recentRecords: true,
      }"
      @select="selectEmoji"
    />
  </div>
</template>

<style scoped>
.container >>> .emoji-header {
  font-size: 14px;
}
.container >>> .emoji-footer {
  font-size: 14px;
}
</style>
