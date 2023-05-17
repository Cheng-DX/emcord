<script setup lang="ts">
import { NInput, NPopover, NTooltip } from 'naive-ui'
import type { Channel, Message, Server } from '@emcord/types'
import type { Ref } from 'vue'
import { OnClickOutside } from '@vueuse/components'
import MessageCard from '~/components/message/MessageCard.vue'
import ServerUsers from '~/components/ServerUsers.vue'
import SearchResult from '~/components/SearchResult.vue'
import FileUploader from '~/components/files/FileUploader.vue'
import FileEditor from '~/components/files/FileEditor.vue'
import type { LoadingFile } from '~/components/files/types'
import { useMenu } from '~/composables/useMenu'
import Selection from '~/components/selection/index.vue'
import type { Option } from '~/components/selection/types'
import EmojiPicker from '~/components/message/EmojiPicker.vue'
import ReferedMessagePreview from '~/components/message/ReferedMessagePreview.vue'

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

const msg = ref('')
const { data } = useFetch(
  () => `/api/channels/${params.value.channelId}/messages?limit=20`, {
    refetch: true,
  },
).json<Message[]>()

const {
  messages,
  sendText,
  sendAttach,
  editMessage,
  removeAttachment,
  messageContainer,
  move,
} = useSocket()

const files = ref<LoadingFile[]>([])
provide('files', files)
function onRemove(url: string) {
  files.value = files.value.filter((file) => file.url !== url)
}

watch(data, n => {
  if (n)
    messages.value = n.reverse()
})

const hasAttachment = computed(() => {
  return files.value.length > 0
})
const replyMode = ref(false)
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

function onRemoveAttach(id: string, url: string) {
  dialog.error({
    title: '确定吗？',
    content: '永久移除该附件',
    transformOrigin: 'center',
    positiveText: '移除',
    positiveButtonProps: {
      type: 'error',
    },
    onPositiveClick: () => {
      const serverId = params.value.serverId as string
      const channelId = params.value.channelId as string
      const msg = messages.value.find((msg) => msg.id === id)
      if (!msg) {
        notification.error({
          title: 'Error',
          content: 'Message not found',
        })
        return
      }
      removeAttachment(serverId, channelId, id, msg, url)
    },
    negativeText: '取消',
    negativeButtonProps: {
      type: 'tertiary',
    },
  })
}

const showEmojiPicker = ref(false)
const emoji = ref('')

const i = () => {}
const msgInput = ref<HTMLInputElement>()
const { current, toggleVisible, onClickItem, position, visible } = useMenu<Message>()

const messageMenuOptions: Option[] = [
  {
    label: '添加反应',
    icon: 'i-ic-baseline-emoji-emotions',
    value: 'add-reaction',
    type: 'success',
    onClick: () => {
      toggleVisible(false)
      showEmojiPicker.value = true
    },
  },
  { label: '编辑信息', icon: 'i-ic-baseline-edit', value: 'edit', onClick: i },
  {
    label: '回复',
    icon: 'i-ic-baseline-reply',
    value: 'reply',
    onClick: () => {
      replyMode.value = true
      msgInput.value?.focus()
    },
  },
  {
    label: '删除信息',
    icon: 'i-ic-baseline-delete-forever',
    value: 'remove',
    type: 'danger',
    onClick: () => {
      dialog.error({
        title: '确定要删除这条消息吗',
        content: () => h(MessageCard, {
          message: current.value!,
          style: {
            'marginBlock': '25px',
            'box-shadow': 'rgba(0, 0, 0, 0.15) 0px 2px 2px 0px !important',
          },
        }),
        style: {
          width: '80vw',
        },
        transformOrigin: 'center',
        positiveText: '删除',
        positiveButtonProps: {
          type: 'error',
        },
        onPositiveClick: async () => {
          try {
            const channelId = params.value.channelId as string
            await useFetch(
              `/api/channels/${channelId}/messages/${current.value!.id}`,
              { method: 'DELETE' },
            ).json()
            messages.value = messages.value.filter(
              (msg) => msg.id !== current.value!.id,
            )
          }
          catch (e: any) {
            notification.error({
              title: 'Error',
              content: e.message,
            })
          }
        },
        negativeText: '取消',
        negativeButtonProps: {
          type: 'tertiary',
        },
      })
    },
  },
]

async function addReaction(emoji: string) {
  const { id } = current.value!
  const channelId = params.value.channelId as string
  const { data: msg } = await useFetch(
    `/api/channels/${channelId}/messages/${id}/reactions/${emoji}/@me`,
    { method: 'PUT' },
  ).json<Message>()
  replaceMsg(msg.value)
}

async function onRemoveReaction(id: string, emoji: string) {
  const channelId = params.value.channelId as string
  const { data: msg } = await useFetch(
    `/api/channels/${channelId}/messages/${id}/reactions/${emoji}/@me`,
    { method: 'DELETE' },
  ).json<Message>()
  replaceMsg(msg.value)
}

function replaceMsg(msg: Message | null) {
  if (!msg)
    return
  const index = messages.value.findIndex((m) => m.id === msg.id)
  if (index !== -1)
    messages.value.splice(index, 1, msg)
}

async function onReactionSelected(emoji: string) {
  showEmojiPicker.value = false
  await addReaction(emoji)
}

function send() {
  const serverId = params.value.serverId as string
  const channelId = params.value.channelId as string
  if (hasAttachment.value && files.value.some((file) => file.status === 'done')) {
    sendAttach(
      serverId, channelId, files.value.filter(file => file.status === 'done'),
      msg.value,
      (replyMode.value && current.value) ? current.value.id : undefined,
    )
    files.value = []
    msg.value = ''
  }
  else if (msg.value) {
    sendText(serverId, channelId, msg.value, (replyMode.value && current.value) ? current.value.id : undefined)
    msg.value = ''
  }

  replyMode.value = false
}
</script>

<template>
  <div
    v-if="showEmojiPicker"
    absolute
    :style="{
      top: '25vh',
      right: '20px',
      zIndex: 3001,
    }"
  >
    <OnClickOutside @trigger="showEmojiPicker = false">
      <EmojiPicker v-model:emoji="emoji" @first-select="onReactionSelected" />
    </OnClickOutside>
  </div>
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
                class="tool"
                @click="toggleShowUsers()"
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
        <OnClickOutside @trigger="toggleVisible(false)">
          <NPopover
            trigger="manual"
            :show="visible"
            :show-arrow="false"
            :style="{
              width: '200px',
              padding: '6px 8px',
              background: 'var(--c-theme-0)',
            }"
            placement="bottom"
            :x="position.x"
            :y="position.y"
            style="transform: translateX(50%);"
          >
            <Selection :options="messageMenuOptions" />
          </NPopover>
        </OnClickOutside>
        <div ref="messageContainer" w-full flex-1 style="overflow: auto;">
          <MessageCard
            v-for="message in messages"
            :key="message.id"
            :message="message"
            w-full
            @remove-attach="onRemoveAttach"
            @remove-reaction="onRemoveReaction"
            @click.right="(e: MouseEvent) => onClickItem(e, message)"
          />
          <div mt-10px />
        </div>
        <footer
          p-3
          flex-col
          items-center
          justify-between
          class="the-footer"
        >
          <div v-if="hasAttachment" w-full h-200px flex items-center bgc-theme-5 r-8 mb-2px>
            <div v-for="file in files" :key="file.url">
              <FileEditor :file="file" @remove="onRemove" />
            </div>
          </div>
          <ReferedMessagePreview
            v-if="replyMode && current"
            :show-bar="false"
            :message="current"
            p-block-10px p-inline-20px flex items-center m-block-2px bgc-theme-5 r-8
          >
            <template #prefix>
              <span font-bold c-text-2 font-italic mr-2px>正在回复至</span>
            </template>
            <template #suffix>
              <div
                font-bold c-change-2 font-italic mr-2px s-24px
                i-carbon-close-filled cursor-pointer
                @click="replyMode = false"
              />
            </template>
          </ReferedMessagePreview>
          <div w-full h-44px flex items-center bgc-theme-5 r-8>
            <div p-inline-16px p-block-10px>
              <FileUploader v-model="files">
                <div i-ic-round-add-circle s-24px />
              </FileUploader>
            </div>
            <div p-block-11px pr-10px style="width: calc(100% - 40px)">
              <input
                ref="msgInput"
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
      <div id="channel-main__right-side" w-auto overflow-auto bgc-theme-2 transition-400>
        <div v-if="showUsers && !showSearch" w-240px>
          <ServerUsers :server="server" />
        </div>
        <div v-show="showSearch" w-450px h-full transition>
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
