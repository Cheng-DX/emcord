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
const imageFailed = ref(false)
</script>

<template>
  <div bgc-theme-2 w-350px max-h-550px flex flex-col gap-4px p-block-8px p-inline-12px r-10>
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
    <NImage
      v-if="embed.image && !imageFailed"
      min-h-100px
      transition
      :src="embed.image"
      style="width: 100%"
      :img-props="{
        style: {
          objectFit: 'contain',
          width: '100%',
        },
      }"
      r-6
      w-full
      @error="imageFailed = true"
    />
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
