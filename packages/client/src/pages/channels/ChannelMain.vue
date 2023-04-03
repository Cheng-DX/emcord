<script setup lang="ts">
import { NInput, NPopover } from 'naive-ui'
import type { Channel, Message, Server } from '@emcord/types'
import type { Ref } from 'vue'

import MessageCard from '~/components/MessageCard.vue'
import ServerUsers from '~/components/ServerUsers.vue'
import SearchResult from '~/components/SearchResult.vue'

const { params } = toRefs(useRoute())

const server = inject<Ref<Server>>('server')
const channels = inject<Ref<Channel[]>>('channels')

const channel = computed(() => {
  if (channels?.value) {
    return channels.value.find(
      (channel) => channel.id === params.value.channelId,
    )
  }
})

const messageContainer = ref<HTMLDivElement>()
const { messages, sendText } = useSocket(messageContainer)
const msg = ref('')

const { data } = useFetch(
  () => `/api/channels/${params.value.channelId}/messages?limit=20`, {
    refetch: true,
  },
).json<Message[]>()

watch(data, (n) => {
  if (n)
    messages.value = n.reverse()
})

function send() {
  if (msg.value) {
    sendText(
      params.value.serverId as string,
      params.value.channelId as string,
      msg.value,
    )
    msg.value = ''
  }
}
const showUsers = useLocalStorage('showUsers', false, {
  mergeDefaults: true,
})
const toggleShowUsers = useToggle(showUsers)

const [showSearch, toggleShowSearch] = useToggle(false)
const query = ref('')
const searchResultRef = ref<typeof SearchResult>()
function search() {
  if (query.value) {
    toggleShowSearch(true)
    searchResultRef.value?.search()
  }
}

watch(query, (newQuery, old) => {
  if (old && !newQuery)
    toggleShowSearch(false)
})
</script>

<template>
  <div min-w-50vw h-full>
    <header
      h-24px
      p-3
      flex
      items-center
      justify-between
      class="the-header"
    >
      <div flex items-center justify-between w-full>
        <div flex items-center>
          <div i-octicon-hash-16 c-text-3 s-22px mr-10px />
          <strong>
            {{ channel?.name }}
          </strong>
        </div>
        <div flex items-center>
          <div i-ic-round-notifications btn-text class="tool" />
          <div i-carbon-pin-filled btn-text class="tool" />
          <NPopover
            :style="{
              padding: '6px 8px',
              background: 'var(--c-theme-0)',
            }"
            c-text-1
            arrow-style="background: var(--c-theme-0)"
          >
            <template #trigger>
              <div
                :class="showUsers ? 'i-ic-twotone-person-off' : 'i-ic-outline-person-outline'"
                btn-text
                class="tool" @click="toggleShowUsers()"
              />
            </template>
            <span>{{ showUsers ? '隐藏成员名单' : '显示成员名单' }}</span>
          </NPopover>

          <NInput
            v-model:value="query"
            m-inline-8px
            size="small"
            placeholder="搜索"
            :clearable="true"
            class="search-input"
            @keypress.enter="search()"
          >
            <template #prefix>
              <div i-carbon-search s-1em />
            </template>
          </NInput>

          <div i-carbon-help-filled btn-text class="tool" />
        </div>
      </div>
    </header>
    <div
      id="channel-main"
      flex
      mt-48px
      style="width: calc(100vw - 240px - 72px); height: calc(100vh - 48px)"
    >
      <div
        id="channel-main__center"
        flex-col
        flex-1
        flex
        mt-4px
        mr-4px
        style="width: calc(100% - 320px)"
        h-full
      >
        <div ref="messageContainer" w-full flex-1 style="overflow: auto;">
          <MessageCard
            v-for="message in messages"
            :key="message.id"
            :message="message"
            wp-80
          />
        </div>
        <footer
          p-3
          flex
          items-center
          justify-between
          class="the-footer"
        >
          <div w-full h-44px flex items-center bgc-theme-5 r-8>
            <div p-inline-16px p-block-10px>
              <div i-ic-round-add-circle s-24px />
            </div>
            <div p-block-11px pr-10px style="width: calc(100% - 40px)">
              <input
                v-model="msg"
                transition
                class="inner-input"
                :placeholder="`给 #${channel?.name} 发消息`"
                @keypress.exact.enter="send()"
              >
            </div>
            <div w-40px p-inline-11px p-block-10px>
              <div i-ic-baseline-emoji-emotions s-24px />
            </div>
          </div>
        </footer>
      </div>
      <div id="channel-main__right-side" w-auto bgc-theme-2 transition-400>
        <div v-if="showUsers && !showSearch" w-240px>
          <ServerUsers :server="server" />
        </div>
        <div v-show="showSearch" w-420px transition>
          <SearchResult ref="searchResultRef" :query="query" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.the-header {
  border-bottom-color: rgba(26, 23, 23, 0.638);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding: 12px 16px;
  font-size: 16px;
  position: absolute;
  top: 0;
  right: 0;
  width: calc(100vw - 240px - 72px - 32px);
}
.the-footer {
  padding: 12px 16px;
  padding-top: 0px;
  font-size: 16px;
  bottom: 0;
  right: 0;
  width: calc(100% - 32px);
  margin-bottom: 24px;
}

.tool {
  margin-inline: 8px;
  height: 24px;
  width: 24px;
  cursor: pointer;
}

.search-input {
  width: 200px;
}

.inner-input {
  outline: none;
  border: none;
  background-color: transparent;
  width: 100%;
}
</style>
