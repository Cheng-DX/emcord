<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider, darkTheme, dateZhCN, zhCN } from 'naive-ui'
</script>

<template>
  <NConfigProvider
    :theme="darkTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
    inline-theme-disabled
  >
    <NDialogProvider>
      <NMessageProvider>
        <div h-full c-text-2>
          <router-view />
        </div>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<style>
:root {
  font-family: PingFang SC;
  overflow: scroll;
}
</style>
