<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import type { Chat } from '@/types'
import MessageBubble from './MessageBubble.vue'
import MessageInput from './MessageInput.vue'
import { useChatStore } from '@/stores/chat'

const props = defineProps<{
  chat: Chat | null
  showBack?: boolean
}>()

defineEmits<{
  back: []
}>()

const store = useChatStore()
const messagesContainer = ref<HTMLElement | null>(null)

const statusLabel = computed(() =>
  props.chat?.online ? 'в сети' : 'не в сети'
)

const initials = computed(() => {
  if (!props.chat) return ''
  const parts = props.chat.user.name.split(' ')
  return parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase()
})

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(
  () => props.chat?.messages.length,
  () => scrollToBottom()
)

watch(
  () => props.chat?.id,
  () => scrollToBottom()
)

function handleSend(text: string) {
  if (!props.chat) return
  store.sendMessage(props.chat.id, text)
}
</script>

<template>
  <section class="chat-window">
    <!-- Empty state -->
    <div v-if="!chat" class="chat-window__empty">
      <p>Выберите чат, чтобы начать переписку</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="chat-window__header">
        <button v-if="showBack" class="chat-window__back" @click="$emit('back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="chat-window__avatar">
          <span class="chat-window__initials">{{ initials }}</span>
        </div>
        <div class="chat-window__user-info">
          <span class="chat-window__name">{{ chat.user.name }}</span>
          <span
            class="chat-window__status"
            :class="chat.online ? 'chat-window__status--online' : 'chat-window__status--offline'"
          >
            {{ statusLabel }}
          </span>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="chat-window__messages">
        <MessageBubble
          v-for="msg in chat.messages"
          :key="msg.id"
          :message="msg"
        />
      </div>

      <!-- Input -->
      <MessageInput @send="handleSend" />
    </template>
  </section>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.chat-window {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  background: $color-bg;

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: $color-text-muted;
    font-size: 16px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: $color-surface;
    border-bottom: 1px solid $color-border;
    flex-shrink: 0;
  }

  &__back {
    background: none;
    border: none;
    color: $color-text;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: $color-accent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__initials {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
  }

  &__user-info {
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-weight: 600;
    font-size: 15px;
  }

  &__status {
    font-size: 12px;

    &--online {
      color: $color-online;
    }

    &--offline {
      color: $color-text-muted;
    }
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
