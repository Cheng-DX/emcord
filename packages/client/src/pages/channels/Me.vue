<script setup lang="ts">
import EmojiPicker from '~/components/message/EmojiPicker.vue'
import '~/composables/useSocket'
const { userInfo } = useUserInfo()
</script>

<template>
  <div>{{ userInfo }}</div>
</template>

<style scoped>

</style>
