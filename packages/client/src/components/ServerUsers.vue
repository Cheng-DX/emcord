<script setup lang="ts">
import type { Server, User } from '@emcord/types'
import UserCard from './UserCard.vue'

const props = defineProps<{
  server?: Server
}>()

const { data: users } = useFetch(
  () => `/api/servers/${props.server?.id}/members?limit=20`, {
    refetch: true,
  },
).json<User[]>()

const { data: onlines } = useFetch(
  () => `/api/servers/${props.server?.id}/members/online?limit=20`, {
    refetch: true,
  },
).json<User[]>()
const onlineIds = computed(() => onlines.value?.map((user) => user.id))
const formatteds = computed(() => {
  return users.value?.map((user) => ({
    ...user,
    online: onlineIds.value?.includes(user.id),
  }))
})
</script>

<template>
  <div v-for="user in formatteds" :key="user.id" flex items-center h-48px m-inline-8px>
    <UserCard
      :user="user"
      :owner="user.id === server?.owner._id"
      :online="user.online"
    />
  </div>
</template>
