<script setup lang="ts">
import ServerButton from '~/components/ServerButton.vue'
import Spliter from '~/components/Spliter.vue'
import { dialog } from '~/composables/discreteApi'
import AddServer from '~/components/AddServer.vue'

const { userInfo } = useUserInfo()
const route = useRoute()
const servers = computed(() => userInfo.value?.servers || [])

function addServer() {
  dialog.create({
    content: () => h(AddServer),
    closable: false,
    showIcon: false,
    title: () => h('strong', { style: { margin: 'auto', fontSize: '20px', padding: '10px' } }, '自定义您的服务器'),
    style: { padding: '0' },
    transformOrigin: 'center',
  })
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
      :key="server._id"
      flex
    >
      <ServerButton
        :name="server.name"
        :to="`/channels/${server._id}/-1`"
        :avator="server.avator"
        :active="route.path.includes(server._id)"
      />
    </div>
    <ServerButton
      name="add"
      avator="https://api.iconify.design/ic:sharp-add-circle.svg?color=%23ffffff"
      :active="true"
      @click="addServer()"
    />
  </div>
</template>
