<script setup lang="ts">
import '~/composables/useSocket'
const { userInfo } = useUserInfo()
</script>

<template>
  <div>{{ userInfo }}</div>
</template>

<style scoped>

</style>
