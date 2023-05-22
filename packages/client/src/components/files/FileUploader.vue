<script setup lang="ts">
import type { AttachmentType } from '@emcord/types'
import { NUpload } from 'naive-ui'
import type { Ref } from 'vue'
import type { LoadingFile } from './types'
import { action } from './action'

const files = inject<Ref<LoadingFile[]>>('files')!

function onFinish(_: any) {
  const target = _.event.target as XMLHttpRequest
  const name = _.file.name
  const response = JSON.parse(target.responseText)
  const { resource_type, bytes, width, height, secure_url } = response
  let type: AttachmentType
  switch (resource_type) {
    case 'image':
      type = 0
      break
    case 'video':
      type = 1
      break
    case 'raw':
      type = 2
      break
    default:
      type = 2
  }

  const index = files.value.findIndex((item) => item.filename === name)
  if (index === -1)
    return
  files.value[index] = {
    filename: name,
    status: 'done',
    url: secure_url,
    type,
    size: bytes,
    width,
    height,
  }
}

function onBeforeUpload({ file }: any) {
  files.value.push({
    filename: file.name,
    status: 'pending',
    url: '',
    type: 0,
  })
}

function onChange(_: any) {
  const { event, file } = _
  if (event?.type !== 'progress' || file.status === 'done' || file.status === 'error')
    return
  const { total, loaded } = event as ProgressEvent
  const i = files.value.findIndex(item => item.filename === file.name)
  if (i === -1)
    return
  files.value[i].status = 'uploading'
  files.value[i].progress = Math.round(loaded / total * 100)
}

function onError(_: any) {
  const { file } = _
  const i = files.value.findIndex(item => item.filename === file.name)
  if (i === -1)
    return
  files.value[i].status = 'error'
}
</script>

<template>
  <div>
    <NUpload
      :action="action"
      multiple
      :show-file-list="false"
      flex cursor-pointer
      @finish="onFinish"
      @before-upload="onBeforeUpload"
      @change="onChange"
      @error="onError"
    >
      <slot />
    </NUpload>
  </div>
</template>
