<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider, darkTheme, dateZhCN, zhCN } from 'naive-ui'
</script>

<template>
  <NConfigProvider
    :theme="darkTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
    inline-theme-disabled
    h-screen c-text-2
  >
    <NDialogProvider>
      <NMessageProvider>
        <router-view id="router-view" />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<style>
:root {
  font-family: PingFang SC;
  overflow: hidden;
  color-scheme: dark;
}
</style>
