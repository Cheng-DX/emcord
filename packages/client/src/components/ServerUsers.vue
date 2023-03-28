<script setup lang="ts">
import type { User } from '@emcord/types'

const props = defineProps<{
  serverId?: string
}>()

const { data: users } = useFetch(
  () => `/api/servers/${props.serverId}/members?limit=20`, {
    refetch: true,
  },
).json<User[]>()
</script>

<template>
  <div v-for="user in users" :key="user.id" flex items-center h-48px m-inline-5px>
    <img :src="user.avator" s-45px>
    <b font-bold>
      {{ user.name }}
    </b>
  </div>
</template>
