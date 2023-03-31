<script setup lang="ts">
import ServerList from './ServerList.vue'
</script>

<template>
  <div id="container" min-h-screen h-full flex flex-row>
    <div min-w-72px bgc-theme-1 h-screen>
      <ServerList />
    </div>
    <div flex-1 bgc-theme-4>
      <RouterView />
    </div>
  </div>
</template>
