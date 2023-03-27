<script setup lang="ts">
import type { Message } from '@emcord/types'

const props = defineProps<{
  message: Message
}>()

const { id, author, content, timestamp } = toRefs(props.message)
</script>

<template>
  <div wp-100 mt-5px mb-5px flex>
    <aside w-50px>
      <img
        :src="author.avator"
        draggable="false"
        s-48px
        cursor-pointer
      >
    </aside>
    <main class="message-body">
      <div flex items-baseline>
        <a text-16px font-700>
          {{ author.name }}
        </a>
        <span
          ml-10px
          text-12px
          c-text-3
          font-bold
        >
          {{ new Date(timestamp).toLocaleDateString() }}
          {{ new Date(timestamp).toLocaleTimeString() }}
        </span>
      </div>
      <div>
        {{ content }}
      </div>
    </main>
  </div>
</template>

<style scoped>

</style>
