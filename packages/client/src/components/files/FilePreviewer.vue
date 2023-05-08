<script setup lang="ts">
import type { Attachment } from '@emcord/types'
import { NCode, NEmpty, NImage, NSpin } from 'naive-ui'

const props = defineProps<{
  file: Attachment
}>()

const emits = defineEmits<{
  (e: 'remove', url: string): void
}>()

function remove(url: string) {
  emits('remove', url)
}

const isImage = computed(() => props.file.type === 0 && !props.file.url.endsWith('.pdf'))

const rawPreview = ref('')
watch(() => props.file, (n) => {
  if (n.type === 2) {
    fetch(n.url)
      .then((res) => res.text())
      .then((text) => {
        rawPreview.value = text
      })
  }
}, { immediate: true })
</script>

<template>
  <div
    flex r-10 position-relative class="container" :style="{
      maxWidth: file.type === 1 ? '350px' : '550px',
    }"
  >
    <div class="toolbox" flex-center gap-10px bg-danger>
      <div i-carbon-delete s-10px class="tool" @click="remove(file.url)" />
    </div>
    <NImage
      v-if="isImage"
      :src="file.url"
      class="preview-media"
      :previewed-img-props="{
        style: {
          maxWidth: '75vw',
        },
      }"
      :style="{
        width: file.width ? `${file.width}px` : 'auto',
        aspectRatio: file.width && file.height ? `${file.width}/${file.height}` : 'auto',
      }"
    />
    <video
      v-else-if="file.type === 1"
      :src="file.url"
      class="preview-media"
      controls
      :style="{
        width: file.width ? `${file.width}px` : 'auto',
        aspectRatio: file.width && file.height ? `${file.width}/${file.height}` : 'auto',
      }"
    />
    <div
      v-else-if="file.type === 2"
      max-h-200px overflow-auto p-4 r-10 w-full
      style="background-color: rgb(42, 45, 49);"
    >
      <NSpin :show="!rawPreview" h-150px :rotate="false">
        <template #icon>
          <div i-carbon-document-unknown class="loading" />
        </template>
        <NCode
          :code="rawPreview"
          :language="file.filename.split('.').pop()"
          class="code"
        />
      </NSpin>
    </div>
    <div v-else>
      {{ file }}
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
  filter: opacity(0.9);
  visibility: hidden;
}
.container:hover > .toolbox {
  visibility: visible;
}
.preview-media {
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  object-fit: contain;
  border-radius: 10px;
}
.preview-media:focus-visible {
  outline: none;
}
.code {
  font-size: 14px;
  line-height: 1.5;
  font-family: 'Noto Sans Mono', monospace;
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
/* animation */
@keyframes loading {
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.1;
  }
}
.loading {
  animation: loading 1.7s infinite ease-in-out;
}
</style>

