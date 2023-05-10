<script setup lang="ts">
import type { Embed } from '@emcord/types'
import { NImage } from 'naive-ui'

const props = defineProps<{
  embed: Embed
}>()
const url = computed(() => new URL(props.embed.link))

function goto() {
  window.open(url.value.href, '_blank')
}
</script>

<template>
  <div bgc-theme-2 w-350px max-h-550px flex flex-col gap-4px p-block-4 p-inline-6 r-10>
    <span font-500 text-2 c-text-3-trans>{{ url.hostname }}</span>
    <span
      c-4ba5f4 text-4 cursor-pointer hover:underline font-400
      @click="goto"
    >{{ embed.title }}</span>
    <div
      v-if="embed.description"
      c-text-3 text-3 overflow-auto max-h-70px
      class="text"
    >
      {{ embed.description }}
    </div>
    <img
      v-if="embed.image"
      min-h-100px
      transition
      :src="embed.image"
      onerror="this.style.display = 'none'"
      r-6
    >
  </div>
</template>

<style scoped>
.text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
