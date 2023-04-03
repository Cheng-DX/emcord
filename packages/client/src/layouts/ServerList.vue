<script setup lang="ts">
import type { Server } from '@emcord/types'
import ServerButton from '~/components/ServerButton.vue'
import Spliter from '~/components/Spliter.vue'
import { openDialog } from '~/composables/discreteApi'
import AddServer from '~/components/AddServer.vue'

const route = useRoute()
const { data: servers } = useFetch('/api/users/@me/servers?limit=10', {
  method: 'get',
}).json<Server[]>()

function addServer() {
  openDialog(() => h(AddServer))
}
</script>

<template>
  <div flex flex-col items-center hp-100>
    <ServerButton
      name="HomePage"
      to="/channels/@me"
      avator="https://api.iconify.design/skill-icons:discord.svg?color=%23ffffff"
      :active="route.path === '/channels/@me'"
      mt-15px
    />
    <Spliter h-2px w-32px mb-8px mt-8px />
    <div
      v-for="server in servers"
      :key="server.id"
      flex
    >
      <ServerButton
        :name="server.name"
        :to="`/channels/${server.id}`"
        :avator="server.avator"
        :active="route.path.includes(server.id)"
      />
    </div>
    <ServerButton
      name="add"
      avator="https://api.iconify.design/ic:sharp-add-circle.svg?color=%23ffffff"
      :active="true"
      :hidden-bar="true"
      @click="addServer()"
    />
  </div>
</template>
