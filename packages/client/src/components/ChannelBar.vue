<script setup lang="ts">
import type { Channel } from '@emcord/types'

defineProps<{
  serverId?: string
  channel: Channel
}>()
const router = useRouter()

function goto(path: string) {
  router.push(path)
}
</script>

<template>
  <div
    flex
    flex-1
    items-center
    p-inline-6px
    m-block-2px
    cursor-pointer
    transition
    r-3
    h-34px
    hover:bgc-404248
    @click="goto(`/channels/${serverId}/${channel.id}`)"
  >
    <img
      src="https://api.iconify.design/octicon:hash-16.svg?color=%23b8b9bf77"
      draggable="false"
      s-18px
      mr-10px
    >
    <div flex items-center>
      <div
        c-text-3
        text-15px
        decoration-none
        style="line-height: 17px;"
        font-500
      >
        {{ channel.name }}
      </div>
    </div>
  </div>
</template>
