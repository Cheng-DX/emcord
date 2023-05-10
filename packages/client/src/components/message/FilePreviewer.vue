<script setup lang="ts">
import type { Attachment } from '@emcord/types'
import { NCode, NImage, NSpin } from 'naive-ui'
import { normalizeSize } from '~/utils/size'

const props = defineProps<{
  file: Attachment
  removable: boolean
}>()

const emits = defineEmits<{
  (e: 'remove', url: string): void
}>()

function remove(url: string) {
  emits('remove', url)
}
function download(url: string) {
  window.open(url)
}
const isImage = computed(() => props.file.type === 0 && !props.file.url.endsWith('.pdf'))

const exclued = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'rar']
const rawPreview = ref('')

const shouldPreview = computed(() => {
  return props.file.type === 2 && !exclued.includes(props.file.filename.split('.').pop()!)
})
watch(() => props.file, (n) => {
  if (shouldPreview.value) {
    fetch(n.url)
      .then((res) => res.text())
      .then((text) => {
        rawPreview.value = text
      })
  }
}, { immediate: true })

const expended = ref(false)

function getIcon(url: string) {
  const ext = url.split('.').pop()
  if (ext === 'pdf')
    return 'i-vscode-icons-file-type-pdf2'
  if (ext === 'doc' || ext === 'docx')
    return 'i-vscode-icons-file-type-word'
  if (ext === 'xls' || ext === 'xlsx')
    return 'i-vscode-icons-file-type-excel'
  if (ext === 'ppt' || ext === 'pptx')
    return 'i-vscode-icons-file-type-powerpoint'
  return 'i-vscode-icons-default-file'
}
</script>

<template>
  <div
    flex r-10 position-relative class="container" :style="{
      maxWidth: file.type === 1 ? '350px' : '550px',
    }"
  >
    <div v-if="!isImage || removable" class="toolbox" flex-center gap-12px bgc-theme-1>
      <div v-if="!isImage" i-carbon-download s-15px class="tool" @click="download(file.url)" />
      <div v-if="removable" i-carbon-delete s-15px class="tool" @click="remove(file.url)" />
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
    <div v-else-if="shouldPreview" bgc-2a2d31 p-block-8px w-full p-inline-6px r-10>
      <div
        overflow-auto w-full min-h-80px
        :style="{
          maxHeight: expended ? '150vh' : '150px',
        }"
      >
        <NSpin :show="!rawPreview" :rotate="false" w-full>
          <template #icon>
            <div i-carbon-document-unknown class="loading" />
          </template>
          <NCode
            :code="rawPreview"
            :language="file.filename.split('.').pop()"
            w-full
            class="code"
          />
        </nspin>
      </div>
      <div
        flex items-center justify-between p-6px
        class="border-top"
        text-1
      >
        <div flex items-center cursor-pointer @click="expended = !expended">
          <div
            s-16px mr-4px
            c-change-2
            i-carbon-chevron-down
            :style="{
              transform: expended ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          />
          <span font-bold>{{ expended ? '收起' : '展开' }}</span>
        </div>
        <div gap-4px c-change-2 font-500 text-1 cursor-pointer @click="download(file.url)">
          <span>{{ file.filename }}</span>
          <span v-if="file.size" ml-6px c-change-3>
            {{ normalizeSize(file.size) }}
          </span>
        </div>
      </div>
    </div>
    <div v-else flex items-center justify-start h-80px gap-10px class="default-card">
      <div :class="getIcon(file.url)" s-65px ml-5px />
      <div c-4ba5f4 ml-5px>
        <div>{{ file.filename }}</div>
        <span v-if="file.size" c-change-3 text-2>
          {{ normalizeSize(file.size) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolbox {
  position: absolute;
  top: 0;
  right: 0;
  height: 25px;
  width: auto;
  padding: 4px 6px;
  border-radius: 5px 10px;
  visibility: hidden;
  z-index: 3001;
}
.container:hover > .toolbox {
  visibility: visible;
}

.border-top {
  border-top: #615f5f96 0.1px solid;
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
  user-select: text;
}
.tool {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.default-card {
  width: 100%;
  border-radius: 10px;
  background-color: #2a2d31;
  padding: 10px;
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

