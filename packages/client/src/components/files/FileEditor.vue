<script setup lang="ts">
import type { Ref } from 'vue'
import { NProgress } from 'naive-ui'
import type { LoadingFile } from './types'

const props = defineProps<{
  file: LoadingFile
}>()
const files = inject<Ref<LoadingFile[]>>('files')!
function remove(url: string) {
  files.value = files.value.filter((file) => file.url !== url)
}

const logo = computed(() => {
  const { type } = props.file
  switch (type) {
    case 0:
      return props.file.url
    case 1:
      return 'https://api.iconify.design/ic:baseline-videocam.svg?color=%23ffffff'
    case 2:
      return 'https://api.iconify.design/carbon:raw.svg?color=%23ffffff'
    default:
      return 'https://api.iconify.design/fluent:document-unknown-16-filled.svg?color=%23ffffff'
  }
})
</script>

<template>
  <div flex flex-col bgc-theme-2 s-170px m-block-6px ml-20px r-10 p-8px position-relative>
    <div class="toolbox" flex-center gap-10px bg-danger>
      <div i-carbon-delete s-10px class="tool" @click="remove(file.url)" />
    </div>
    <img v-if="file.status === 'done'" :src="logo" w-full hp-80 object-contain>
    <div v-else flex-center w-full hp-80>
      <NProgress
        :percentage="file.progress"
        indicator-placement="inside"
        :show-indicator="file.status === 'uploading'"
        :processing="file.status === 'uploading'"
        :status="file.status === 'error' ? 'error' : 'success'"
        :stroke-width="1"
      />
    </div>
    <div hp-20 text-3 c-text-2 flex items-center class="i">
      <span>
        {{ file.filename }}
        {{ file.status === 'error' ? '上传失败' : '' }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.toolbox {
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  width: auto;
  padding: 4px 6px;
  border-radius: 5px 10px;
  filter: opacity(0.7);
}
.tool {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
.i {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
