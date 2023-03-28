<script setup lang="ts">
import type { Channel } from '@emcord/types'

const props = defineProps<{
  serverId?: string
  channel: Channel
  hasUnread?: boolean
}>()

const routerPath = computed(() => {
  return `/channels/${props.serverId}/${props.channel.id}`
})
const route = useRoute()
const router = useRouter()

const isActive = computed(() => {
  return route.path === routerPath.value
})

function settings() {
  // console.log('settings')
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
    hover:bgc-35373d
    :style="{
      'background-color': isActive ? '#404248' : '',
    }"
    class="channel-bar"
    :class="isActive ? 'active' : ''"
    @click="() => router.push(routerPath)"
  >
    <div
      v-if="hasUnread"
      class="status-bar slow-transition"
    />
    <img
      src="https://api.iconify.design/octicon:hash-16.svg?color=%23b8b9bf77"
      draggable="false"
      s-18px
      mr-10px
    >
    <div flex items-center justify-between w-full>
      <div
        :class="isActive ? 'c-text-0' : 'c-text-3'"
        text-15px
        decoration-none
        style="line-height: 17px;"
        font-500
      >
        {{ channel.name }}
      </div>
      <div flex-center class="setting-box">
        <div
          i-heroicons-cog-8-tooth-20-solid
          s-14px
          c-b8b9bf77
          hover:c-text-2
          transition
          @click="settings()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* visible when outer div is hoverd */
.setting-box {
  display: none;
}

.channel-bar:hover .setting-box {
  display: flex;
}

.active .setting-box {
  display: flex;
}

.status-bar {
  position: absolute;
  display: block;
  width: 4px;
  border-radius: 0 4px 4px 0;
  margin-left: -14px;
  background-color: #f3f4f5;
  height: 8px;
}

.slow-transition {
  transition: all cubic-bezier(0.4, 0, 0.2, 1) 300ms;
}
</style>
