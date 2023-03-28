<script setup lang="ts">
import type { Channel, Server } from '@emcord/types'
import { NPopover } from 'naive-ui'
import { OnClickOutside } from '@vueuse/components'
import ChannelBar from '~/components/ChannelBar.vue'
import Selection from '~/components/selection/index.vue'
import type { Option } from '~/components/selection/types'
import AddChannel from '~/components/AddChannel.vue'

const props = defineProps<{
  channels: Channel[] | null
  server: Server | null
}>()

const [menu, toggleMenu] = useToggle(false)
const menus: Option[] = [{
  label: '新建频道',
  icon: 'i-ic-round-reviews',
  onClick: () => {
    openDialog(() => h(AddChannel, {
      serverId: props.server?.id,
    }))
  },
  value: 'create-channel',
  type: 'success',
  color: 'green',
}, {
  label: '服务器设置',
  icon: 'i-ic-baseline-settings',
  onClick: () => {
  },
  value: 'server-settings',
  type: 'primary',
}]
</script>

<template>
  <NPopover
    trigger="manual" :show="menu" :show-arrow="false" :style="{
      width: '200px',
      padding: '6px 8px',
      background: '#111214',
    }"
  >
    <template #trigger>
      <header
        h-24px p-3 flex items-center justify-between class="the-header"
        bgc-2b2d30 hover:bgc-35373d transition cursor-pointer
        @click="toggleMenu(!menu)"
      >
        <div flex items-center c-text-0>
          <strong>
            {{ server?.name }}
          </strong>
        </div>
        <div
          cursor-pointer
          i-ic-baseline-keyboard-arrow-down
          :class="menu && 'rotate--180'"
          transition-300
          s-22px
        />
      </header>
    </template>
    <Selection :options="menus" />
  </NPopover>
  <div bgc-2b2d30 style="height: calc(100% - 50px)">
    <div c-text-3 pt-30px text-2 ml-20px>
      文字频道
    </div>
    <div h-30px flex-col items-center justify-between class="channel">
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
  padding: 0px 8px;
}
</style>
