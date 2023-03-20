<script setup lang="ts">
import ServerList from './ServerList.vue'
</script>

<template>
  <div min-h-screen flex flex-row>
    <div w-72px bgc-1e1f22>
      <ServerList />
    </div>
    <div flex-1 bgc-313338>
      <RouterView />
    </div>
  </div>
</template>
