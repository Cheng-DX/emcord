<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  darkTheme,
} from 'naive-ui'
import hljs from 'highlight.js/lib/common'
</script>

<template>
  <NConfigProvider
    :theme="darkTheme"
    :hljs="hljs"
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
  font-family: 'Lato' sans-serif;
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
</style>
