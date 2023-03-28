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
        <div>
          <router-view id="router-view" />
        </div>
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
  width: 8px;
  height: 0;
  background-color: #2b2d32;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #1a1b1e;
  border-radius: 8px;
}
</style>
