<script setup lang="ts">
import type { Message } from '@emcord/types'

const props = defineProps<{
  message: Message
}>()

const { id, author, content, timestamp } = toRefs(props.message)
</script>

<template>
  <div mt-5px mb-5px flex class="card" hover:bgc-2e3035>
    <aside w-40px>
      <img
        :src="author.avator"
        draggable="false"
        s-40px
        cursor-pointer
        r-50
      >
    </aside>
    <main class="message-body">
      <div flex items-baseline>
        <span text-16px font-500 style="line-height: 0.85em">
          {{ author.name }}
        </span>
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
      <div class="text">
        {{ content }}
      </div>
    </main>
  </div>
</template>

<style scoped>
.card {
  padding: 2px 48px 2px 20px;
  margin-top: 17px;
  width: calc(100% - 68px);
  border-radius: 5px;
}
.message-body {
  margin-left: 16px;
  width: calc(100% - 50px - 16px);
}
.text {
  /* width: calc(100vw - 240px - 72px - 48px - 85px); */
  width: 100%;
  line-height: 1.5rem;
  word-wrap: break-word;
  user-select: text;
}
</style>
