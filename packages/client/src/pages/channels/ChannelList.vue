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

const emits = defineEmits<{
  (e: 'reload'): void
}>()
const [serverMenu, toggleServerMenu] = useToggle(false)
const serverMenuOptions: Option[] = [{
  label: '新建频道',
  icon: 'i-ic-round-reviews',
  onClick: () => {
    toggleServerMenu(false)
    const dialog = openDialog(() => h(AddChannel, {
      serverId: props.server?.id,
      onClose: (channel) => {
        if (channel)
          emits('reload')

        dialog.destroy()
      },
    }))
  },
  value: 'create-channel',
  type: 'success',
}, {
  label: '服务器设置',
  icon: 'i-ic-baseline-settings',
  onClick: () => {
  },
  value: 'server-settings',
  type: 'primary',
}, {
  label: '服务器设置',
  icon: 'i-ic-baseline-settings',
  onClick: () => {
  },
  value: 'server-settings',
  type: 'danger',
}, {
  label: '服务器设置',
  icon: 'i-ic-baseline-settings',
  onClick: () => {
  },
  value: 'server-settings',
}]

const [channelMenu, toggleChannelMenu] = useToggle(false)
const channelMenuPosition = reactive({
  x: 0,
  y: 0,
})

const clickedChannel = ref<Channel | null>(null)
const channelMenuOptions: Option[] = [{
  label: '频道设置',
  icon: 'i-ic-round-settings',
  onClick: () => {
  },
  value: 'create-channel',
  type: 'primary',
}, {
  label: '复制ID',
  icon: 'i-carbon-checkmark-filled',
  onClick: () => {
  },
  value: 'copy-id',
  type: 'primary',
}]
function openChannelMenu(e: MouseEvent, channel: Channel) {
  e.preventDefault()
  channelMenuPosition.x = e.clientX
  channelMenuPosition.y = e.clientY
  toggleChannelMenu(true)
  clickedChannel.value = channel
}
</script>

<template>
  <NPopover
    trigger="manual"
    :show="serverMenu"
    :show-arrow="false"
    :style="{
      width: '200px',
      padding: '6px 8px',
      background: 'var(--c-theme-0)',
    }"
  >
    <template #trigger>
      <header
        h-24px p-3 flex items-center justify-between class="the-header"
        theme-2 transition cursor-pointer
        @click="toggleServerMenu(!serverMenu)"
      >
        <div flex items-center c-text-0>
          <strong>
            {{ server?.name }}
          </strong>
        </div>
        <div
          cursor-pointer
          i-ic-baseline-keyboard-arrow-down
          :class="serverMenu ? 'i-ic-cancel' : 'i-ic-baseline-keyboard-arrow-down'"
          transition-300
          s-22px
        />
      </header>
    </template>
    <Selection :options="serverMenuOptions" />
  </NPopover>
  <div bgc-theme-2 style="height: calc(100% - 50px)">
    <div c-text-3 pt-30px text-2 ml-20px>
      文字频道
    </div>
    <OnClickOutside @trigger="toggleChannelMenu(false)">
      <NPopover
        trigger="manual"
        :show="channelMenu"
        :show-arrow="false"
        :style="{
          width: '200px',
          padding: '6px 8px',
          background: 'var(--c-theme-0)',
        }"
        placement="bottom"
        :x="channelMenuPosition.x"
        :y="channelMenuPosition.y"
        style="transform: translateX(50%);"
      >
        <Selection :options="channelMenuOptions" />
      </NPopover>
    </OnClickOutside>
    <div h-30px flex-col items-center justify-between class="channel">
      <ChannelBar
        v-for="channel in channels"
        :key="channel.id"
        :channel="channel"
        :server-id="server?.id"
        :has-unread="true"
        @click.right="e => openChannelMenu(e, channel)"
      />
    </div>
  </div>
</template>

<style scoped>
.the-header {
  border-bottom-color: #1a1717a3;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 12px 16px;
  font-size: 16px;
}
.channel {
  padding: 0px 8px;
}
</style>
