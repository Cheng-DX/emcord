<script setup lang="ts">
defineProps<{
  avator?: string
  active?: boolean
  to?: string
  name: string
  imgClass?: string
  hiddenBar?: boolean
}>()

const router = useRouter()
const state = ref('none')

function set(s: string) {
  state.value = s
}
const isHover = computed(() => state.value === 'hover')
</script>

<template>
  <div
    flex
    items-center
    cursor-pointer
    mb-8px
    @mouseenter="() => set('hover')"
    @mouseleave="() => set('none')"
    @click="() => to && router.push(to)"
  >
    <div
      v-if="!hiddenBar"
      class="status-bar"
      transition-all
      :style="{ height: `${active ? 35 : (isHover ? 20 : 10)}px` }"
    />
    <img
      :src="avator"
      :class="imgClass || ''"
      :style="{ borderRadius: `${(active || isHover) ? 15 : 50}px` }"
      draggable="false"
      s-48px
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
