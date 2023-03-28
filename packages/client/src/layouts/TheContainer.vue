<script setup lang="ts">
import ServerList from './ServerList.vue'
</script>

<template>
  <div id="container" min-h-screen h-full flex flex-row>
    <div min-w-72px bgc-1e1f22 h-screen>
      <ServerList />
    </div>
    <div flex-1 bgc-313338>
      <RouterView />
    </div>
  </div>
</template>
