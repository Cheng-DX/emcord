<script setup lang="ts">
import type { Channel } from '@emcord/types'

defineProps<{
  serverId?: string
  channel: Channel
}>()

const route = useRoute()
</script>

<template>
  <div flex items-center>
    <img
      src="https://api.iconify.design/octicon:hash-16.svg?color=%23b8b9bf"
      draggable="false"
      s-18px
      mr-10px
    >
    <div flex>
      <router-link
        :to="`/channels/${serverId}/${channel.id}`"
        c-text-3
        text-17px
      >
        {{ channel.name }}
      </router-link>
    </div>
  </div>
</template>
