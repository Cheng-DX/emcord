<script setup lang="ts">
import type { Attachment, AttachmentType } from '@emcord/types'
import { NUpload } from 'naive-ui'

const props = defineProps<{
  modelValue: Attachment[]
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: Attachment[]): void
}>()

const files = ref<Attachment[]>(props.modelValue)
function onFinish(_: any) {
  const target = _.event.target as XMLHttpRequest
  const name = _.file.name
  const response = JSON.parse(target.responseText)
  const { resource_type, byte, width, height, secure_url } = response
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
  files.value.push({ filename: name, url: secure_url, size: byte, width, height, type })
  emits('update:modelValue', files.value)
}

function onRemove({ file }: any) {
  const index = files.value.findIndex((item) => item.filename === file.name)
  if (index === -1)
    return
  files.value.splice(index, 1)
}
</script>

<template>
  <div>
    <NUpload
      action="https://api.cloudinary.com/v1_1/dwnw5imiw/upload?upload_preset=ggtgkcea"
      multiple
      :show-file-list="false"
      flex cursor-pointer
      @finish="onFinish"
      @remove="onRemove"
    >
      <slot />
    </NUpload>
  </div>
</template>
