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
</script>

<template>
  <div v-for="user in users" :key="user.id" flex items-center h-48px m-inline-8px>
    <UserCard :user="user" />
  </div>
</template>
