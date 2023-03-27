<script setup lang="ts">
import type { Channel, Server } from '@emcord/types'
import ChannelBar from '~/components/ChannelBar.vue'

const props = defineProps<{
  serverId: string
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
  <div bgc-2b2d30 style="height: calc(100% - 55px)">
    <div h-30px flex items-center justify-between class="channel">
      <ChannelBar
        v-for="channel in channels"
        :key="channel.id"
        :channel="channel"
        :server-id="serverId"
      />
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
