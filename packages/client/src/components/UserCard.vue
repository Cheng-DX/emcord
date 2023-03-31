<script setup lang="ts">
import type { User } from '@emcord/types'

const props = defineProps<{
  user: User
  owner?: boolean
}>()
</script>

<template>
  <div
    flex items-center w-full p-inline-8px
    cursor-pointer
    transition
    h-42px
    hover:bgc-theme-2-hover
    r-5
    c-text-3
    hover:c-text-1
  >
    <div mr-12px h-32px>
      <img :src="user.avator" r-50 s-32px>
    </div>
    <span font-500 text-16px>
      {{ user.name }}
    </span>
  </div>
</template>

<style scoped>

</style>
