<script setup lang="ts">
import type { Embed } from '@emcord/types'

const props = defineProps<{
  embed: Embed
}>()
const url = computed(() => new URL(props.embed.link))
</script>

<template>
  <div bgc-theme-2 max-w-350px max-h-550px flex flex-col gap-4px>
    <span text-3>{{ url.hostname }}</span>
    <span c-4ba5f4 text-5>{{ embed.title }}</span>
    <span v-if="embed.description" c-text-2 text-3>{{ embed.description }}</span>
    <img
      v-if="embed.image"
      :src="embed.image"
      :alt="embed?.description"
      r-6
    >
  </div>
</template>

<style scoped>

</style>
