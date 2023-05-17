<script setup lang="ts">
import type { Channel, Server } from '@emcord/types'
import ChannelList from './ChannelList.vue'
import { useActiveTabs } from '~/composables/useActiveTabs'

const { params } = toRefs(useRoute())
const { data: channels, execute: reloadChannels } = useFetch(
  () => `/api/servers/${params.value.serverId as string}/channels?limit=100`, {
    refetch: true,
  },
).json<Channel[]>()
const { activeTabs } = useActiveTabs()

const router = useRouter()
watch(() => params.value!.serverId, (id) => {
  const channelId = activeTabs.value[id as string] || channels.value?.at(0)?.id
  router.push(`/channels/${id}/${channelId}`)
})

const { data: server } = useFetch(
  () => `/api/servers/${params.value.serverId as string}`, {
    refetch: true,
  },
).json<Server>()

provide('server', server)
provide('channels', channels)
</script>

<template>
  <div flex flex-row h-full>
    <aside w-240px>
      <ChannelList
        :channels="channels!"
        :server="server!"
        @reload="reloadChannels()"
      />
    </aside>
    <main flex-1 h-full>
      <router-view v-slot="{ Component }" :key="params.serverId as string">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </main>
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
</style>
