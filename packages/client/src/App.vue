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
</template>

<style>
:root {
  font-family: PingFang SC;
  color-scheme: dark;
}
</style>
