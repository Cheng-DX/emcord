<script setup lang="ts">
import { defineExpose } from 'vue'
import type { Message } from '@emcord/types'

const props = defineProps<{
  query: string
}>()

const message = ref<Message[]>([])
function search() {
  console.log('search', props.query)
}

defineExpose<{ search: () => void }>({
  search,
})
</script>

<template>
  {{ query }}
</template>

<style scoped>

</style>
