<script setup lang="ts">
import type { Channel, Server } from '@emcord/types'

const props = defineProps<{
  serverId: string | string[]
}>()

const { data: server } = useFetch(
  () => `/api/servers/${props.serverId}`, {
    refetch: true,
  },
).json<Server>()

const { data: channels } = useFetch(
  () => `/api/servers/${props.serverId}/channels`, {
    refetch: true,
  },
).json<Channel[]>()
</script>

<template>
  <header h-30px p-3 flex items-center justify-between class="the-header" bgc-2b2d30>
    <div flex items-center>
      <strong>
        {{ server?.name }}
      </strong>
    </div>
    <div
      cursor-pointer
      i-ic-baseline-keyboard-arrow-down
      s-25px
    />
  </header>
  <div bgc-2b2d30 h-full>
    <div h-30px flex items-center justify-between class="channel">
      <div flex items-center>
        <img
          src="https://api.iconify.design/prime:hashtag.svg?color=%23ffffff"
          draggable="false"
          s-25px
          font-bold
          mr-10px
        >
        <div>
          <router-link
            v-for="channel in channels"
            :key="channel.id"
            :to="`/channels/${serverId}/${channel.id}`"
            c-text-3
          >
            {{ channel.name }}
          </router-link>
        </div>
      </div>
      <div i-carbon-add />
    </div>
  </div>
</template>

<style scoped>
.the-header {
  border-bottom-color: rgba(26, 23, 23, 0.638);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 12px 16px;
  font-size: 16px;
}
.channel {
  padding: 10px 20px;
}
</style>
