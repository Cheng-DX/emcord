<script setup lang="ts">
import { useStatus } from '~/composables/useStatus'

defineProps<{
  avator?: string
  active?: boolean
  to?: string
  name: string
  imgClass?: string
}>()

const router = useRouter()
const { ishover, set } = useStatus(['active', 'hover', 'new', 'none'], 'none')
</script>

<template>
  <div
    flex
    items-center
    cursor-pointer
    @mouseenter="() => set('hover')"
    @mouseleave="() => set('none')"
    @click="() => to && router.push(to)"
  >
    <div
      class="status-bar"
      transition-all
      :style="{ height: `${active ? 35 : (ishover ? 20 : 10)}px` }"
    />
    <img
      :src="avator"
      s-48px
      :class="imgClass || ''"
      :style="{ borderRadius: `${(active || ishover) ? 15 : 50}px` }"
      transition-all
    >
  </div>
</template>

<style scoped>
.status-bar {
  position: absolute;
  display: block;
  width: 8px;
  border-radius: 0 4px 4px 0;
  margin-left: -15px;
  background-color: #f3f4f5
}
</style>
