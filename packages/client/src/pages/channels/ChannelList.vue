<script setup lang="ts">
import type { Channel, Server } from '@emcord/types'
import ChannelBar from '~/components/ChannelBar.vue'

defineProps<{
  channels: Channel[] | null
  server: Server | null
}>()
</script>

<template>
  <header h-24px p-3 flex items-center justify-between class="the-header" bgc-2b2d30>
    <div flex items-center c-text-0>
      <strong>
        {{ server?.name }}
      </strong>
    </div>
    <div
      cursor-pointer
      i-ic-baseline-keyboard-arrow-down
      s-22px
    />
  </header>
  <div bgc-2b2d30 style="height: calc(100% - 49px)">
    <div h-30px flex items-center justify-between class="channel">
      <ChannelBar
        v-for="channel in channels"
        :key="channel.id"
        :channel="channel"
        :server-id="server?.id"
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
