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
      class="status-bar slow-transition"
      :style="{ height: `${active ? 35 : (isHover ? 20 : 10)}px` }"
    />
    <img
      :src="avator"
      :class="imgClass || ''"
      class="slow-transition"
      :style="{ borderRadius: `${(active || isHover) ? 18 : 50}px` }"
      draggable="false"
      transition
      s-48px
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
  background-color: var(--c-text-1)
}

.slow-transition {
  transition: all cubic-bezier(0.4, 0, 0.2, 1) 300ms;
}
</style>
