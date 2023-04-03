<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  darkTheme,
} from 'naive-ui'
</script>

<template>
  <NConfigProvider
    :theme="darkTheme"
    h-screen
    c-text-2
  >
    <NDialogProvider>
      <NMessageProvider style="height: auto;" placement="bottom-right">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
  <div id="uno" bg-success bg-primary bg-danger />
</template>

<style>
:root {
  font-family: PingFang SC;
  color-scheme: dark;
  user-select: none;
}

* {
  box-shadow: none !important;
}

::-webkit-scrollbar {
  width: 5px;
  height: 0;
}

::-webkit-scrollbar-thumb {
  background-color: var(--c-text-3-trans);
  border-radius: 4px;
}
</style>
