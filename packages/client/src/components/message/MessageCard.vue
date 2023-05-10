<script setup lang="ts">
import type { Message } from '@emcord/types'
import FilePreviewer from './FilePreviewer.vue'
import EmbedPreview from './EmbedPreview.vue'
import ReactionPreview from './ReactionPreview.vue'
import ReferedMessagePreview from './ReferedMessagePreview.vue'

const props = defineProps<{
  message: Message
}>()
const emits = defineEmits<{
  (event: 'removeAttach', id: string, url: string): void
  (event: 'removeReaction', id: string, emoji: string): void
}>()

provide('message', props.message)
const { author, content, timestamp } = toRefs(props.message)
function remove(url: string) {
  emits('removeAttach', props.message.id, url)
}
function removeReaction(emoji: string) {
  emits('removeReaction', props.message.id, emoji)
}
</script>

<template>
  <div>
    <ReferedMessagePreview
      v-if="message.referencedMessagePreview"
      :message="message.referencedMessagePreview"
      show-bar
      ml-40px
      :style="{
        marginTop: message.referencedMessagePreview ? '16px' : '0',
      }"
    />
    <div
      mb-5px flex hover:bgc-theme-3
      class="card"
      :style="{
        marginTop: message.referencedMessagePreview ? '3px' : '16px',
      }"
    >
      <aside w-40px>
        <img
          :src="author.avator"
          draggable="false"
          s-40px
          cursor-pointer
          r-50
        >
      </aside>
      <main class="message-body">
        <div flex items-baseline>
          <span text-4 font-500 c-text-1 style="line-height: 0.85em">
            {{ author.name }}
          </span>
          <span
            ml-10px
            text-12px
            c-text-3
            font-400
          >
            {{ new Date(timestamp).toLocaleDateString() }}
            {{ new Date(timestamp).toLocaleTimeString() }}
          </span>
        </div>
        <div class="text">
          {{ content }}
        </div>
        <div v-if="message.attachments.length > 0" gap-4px m-block-8px>
          <FilePreviewer
            v-for="file in message.attachments"
            :key="file.url"
            m-block-8px
            :file="file"
            :removable="message.attachments.length > 1"
            @remove="remove"
          />
        </div>
        <div v-if="message.embeds.length > 0" flex flex-col gap-4px m-block-8px>
          <EmbedPreview
            v-for="embed in message.embeds"
            :key="embed.link"
            :embed="embed"
          />
        </div>
        <div v-if="message.reactions.length > 0" flex gap-4px m-block-4px>
          <ReactionPreview
            v-for="reaction in message.reactions"
            :key="reaction.emoji.id"
            :reaction="reaction"
            @remove-reaction="removeReaction"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 2px 48px 2px 20px;
  width: calc(100% - 68px);
  border-radius: 5px;
}
.message-body {
  margin-left: 16px;
  width: calc(100% - 50px - 16px);
}
.text {
  width: 100%;
  line-height: 1.5rem;
  word-wrap: break-word;
  user-select: text;
  padding-block: 4px;
}
</style>
