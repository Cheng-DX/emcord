<script setup lang="ts">
defineProps<{
  options: {
    label: string
    value: string
    onClick: () => void
    icon: string
    type?: 'primary' | 'success' | 'danger'
    color?: string
  }[]
}>()
</script>

<template>
  <div flex flex-col>
    <div
      v-for="option in options"
      :key="option.value"
      flex
      items-center
      justify-between
      p-block-6px
      p-inline-8px
      m-block-2px
      cursor-pointer
      transition
      :class="option.type ? `bg-${option.type}` : ''"
      bg-transparent
      h-22px
      r-2
      c-text-2
      font-600
      :style="{
        color: option.color,
      }"
      class="option"
      @click="option.onClick()"
    >
      <span h-18px style="line-height: 18px;">{{ option.label }}</span>
      <i :class="option.icon" s-18px ml-3px />
    </div>
  </div>
</template>

<style scoped>
.option:hover {
  color: #fff !important;
}
</style>
