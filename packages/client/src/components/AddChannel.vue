<script setup lang="ts">
import type { Channel } from '@emcord/types'
import { NInput, NSwitch } from 'naive-ui'

const props = defineProps<{
  serverId?: string
}>()

const emits = defineEmits<{
  (e: 'close', channel?: Channel): void
}>()

const channelName = ref('')
const isPrivate = ref(false)
async function createChannel() {
  if (!channelName.value || !props.serverId)
    return
  try {
    const { data: channel } = await useFetch(`/api/servers/${props.serverId}/channels`, {
      method: 'POST',
      body: JSON.stringify({
        name: channelName.value,
        isPrivate: isPrivate.value,
        type: 1, // TODO default as 1
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).json<Channel>()
    emits('close', channel.value!)
  }
  catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div h-auto>
    <div p-inline-18px p-block-12px>
      <div flex justify-between items-center mb-20px>
        <div font-bold text-20px>
          创建频道
        </div>
        <div i-ic-round-close s-27px c-change-3 cursor-pointer @click="() => emits('close')" />
      </div>
      <div>
        <div text-3 font-700 mb-4px>
          频道名称
        </div>
        <NInput v-model:value="channelName" placeholder="" style="outline: none;">
          <template #prefix>
            <div i-octicon-hash-16 c-text-3 mr-1px s-18px />
          </template>
        </ninput>
      </div>
      <div flex items-center justify-between pt-12px>
        <div flex-center font-bold text-17px>
          <div i-ic-sharp-lock-person c-text-3 s-15px mr-6px />
          私密频道
        </div>
        <NSwitch
          v-model:value="isPrivate"
          style="transform: scale(1.15);"
          mr-5px
        >
          <template #icon>
            <div
              class="icon right" :style="{
                transform: isPrivate ? 'translate(2px) rotate(45deg)' : 'rotate(-45deg)',
                backgroundColor: isPrivate ? 'green' : 'red',
              }"
            />
            <div
              class="icon left" :style="{
                transform: isPrivate ? 'translate(-2px, 2px) rotate(-45deg)' : 'rotate(45deg)',
                height: isPrivate ? '5px' : '10px',
                backgroundColor: isPrivate ? 'green' : 'red',
              }"
            />
          </template>
        </NSwitch>
      </div>
      <div c-text-3 mt-5px>
        只有我可以看到这个频道
      </div>
    </div>
    <div bgc-theme-1-trans h-60px flex items-center justify-end>
      <button
        mr-20px h-40px w-90px btn-primary :disabled="channelName === ''" @click="createChannel()"
      >
        创建频道
      </button>
    </div>
  </div>
</template>

<style scoped>
.icon {
  width: 2px;
  height: 10px;
  position: absolute;
  background-color: red;
  border-radius: 1px;
  transition: 300ms;
}
.right {
  transform: rotate(45deg);
}
.left {
  transform: rotate(-45deg);
}
</style>
