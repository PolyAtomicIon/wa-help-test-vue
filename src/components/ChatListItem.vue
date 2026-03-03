<script setup lang="ts">
import type { Chat } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  chat: Chat
  active: boolean
}>()

defineEmits<{
  select: [id: number]
}>()

const lastMessage = computed(() => {
  if (!props.chat.messages.length) return ''
  const msg = props.chat.messages[props.chat.messages.length - 1]!
  const prefix = msg.incoming ? '' : 'Вы: '
  const text = msg.text.length > 40 ? msg.text.slice(0, 40) + '…' : msg.text
  return prefix + text
})

const lastTime = computed(() => {
  if (!props.chat.messages.length) return ''
  const msg = props.chat.messages[props.chat.messages.length - 1]!
  return formatTime(msg.timestamp)
})

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

const initials = computed(() => {
  const parts = props.chat.user.name.split(' ')
  return parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase()
})
</script>

<template>
  <div
    class="chat-item"
    :class="{ 'chat-item--active': active }"
    @click="$emit('select', chat.id)"
  >
    <div class="chat-item__avatar">
      <span class="chat-item__initials">{{ initials }}</span>
      <span
        class="chat-item__status"
        :class="chat.online ? 'chat-item__status--online' : 'chat-item__status--offline'"
      ></span>
    </div>
    <div class="chat-item__info">
      <div class="chat-item__top">
        <span class="chat-item__name">{{ chat.user.name }}</span>
        <span class="chat-item__time">{{ lastTime }}</span>
      </div>
      <div class="chat-item__bottom">
        <span class="chat-item__last-msg">{{ lastMessage }}</span>
        <span v-if="chat.unread > 0" class="chat-item__badge">{{ chat.unread }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid $color-border;
  transition: background $transition-speed;

  &:hover {
    background: $color-surface-light;
  }

  &--active {
    background: $color-primary;
  }

  &__avatar {
    position: relative;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: $color-accent;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__initials {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
  }

  &__status {
    position: absolute;
    bottom: 1px;
    right: 1px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid $color-surface;

    &--online {
      background: $color-online;
    }

    &--offline {
      background: $color-offline;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  &__name {
    font-weight: 600;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__time {
    font-size: 12px;
    color: $color-text-muted;
    flex-shrink: 0;
    margin-left: 8px;
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__last-msg {
    font-size: 13px;
    color: $color-text-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__badge {
    flex-shrink: 0;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background: $color-accent;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    margin-left: 8px;
  }
}
</style>
