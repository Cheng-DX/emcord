<script setup lang="ts">
import type { User } from '@emcord/types'

const props = defineProps<{
  user: User
  owner?: boolean
  online?: boolean
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
    <div mr-12px h-32px position-relative>
      <img :src="user.avator" r-50 s-32px>
      <div
        :class="online ? 'bg-green' : 'bg-gray'"
        s-10px r-10 ml-8px position-absolute right--3px bottom-0 border border-white
      />
    </div>
    <span font-500 text-4>
      {{ user.name }}
    </span>
    <img v-if="owner" s-13px ml-8px src="https://api.iconify.design/twemoji:crown.svg?color=%23787878">
  </div>
</template>

<style scoped>

</style>
