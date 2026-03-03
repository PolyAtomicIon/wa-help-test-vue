<script setup lang="ts">
import { useChatStore } from '@/stores/chat'
import ChatListItem from './ChatListItem.vue'

const store = useChatStore()

defineEmits<{
  select: [id: number]
}>()
</script>

<template>
  <aside class="chat-list">
    <div class="chat-list__header">
      <h2>Чаты</h2>
    </div>
    <div class="chat-list__items">
      <ChatListItem
        v-for="chat in store.sortedChats"
        :key="chat.id"
        :chat="chat"
        :active="chat.id === store.activeChatId"
        @select="$emit('select', $event)"
      />
    </div>
  </aside>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.chat-list {
  display: flex;
  flex-direction: column;
  width: 340px;
  min-width: 280px;
  background: $color-surface;
  border-right: 1px solid $color-border;
  height: 100%;

  @media (max-width: $mobile-breakpoint) {
    width: 100%;
    border-right: none;
  }

  &__header {
    padding: 16px 20px;
    border-bottom: 1px solid $color-border;
    flex-shrink: 0;

    h2 {
      font-size: 20px;
      font-weight: 700;
    }
  }

  &__items {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
