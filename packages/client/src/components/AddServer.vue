<script setup lang="ts">
import { NButton, NFormItem, NInput, NUpload } from 'naive-ui'

const serverName = ref('')

function a() {
  console.log('1')
}
</script>

<template>
  <div h-auto>
    <p font-bold align="center" p-10px>
      一个名称以及一个图标就能赋予您的服务器个性。之后，您可以随时进行变更。
    </p>
    <NUpload />
    <NFormItem label="服务器名称" label-placement="top" label-style="font-size: 10px" required p-10px>
      <NInput v-model:value="serverName" placeholder="" />
    </NFormItem>
    <div bgc-1e1f2288 h-60px flex items-center justify-end>
      <button
        mr-20px h-40px w-90px btn-primary :disabled="serverName === ''" @click="a"
      >
        创建
      </button>
      <button
        mr-20px h-40px w-90px btn-success :disabled="serverName === ''"
      >
        创建
      </button>
      <button
        mr-20px h-40px w-90px btn-danger :disabled="serverName === ''"
      >
        创建
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
