<script setup lang="ts">
import type { Message } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  message: Message
}>()

const time = computed(() => {
  const d = new Date(props.message.timestamp)
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
})

/** Simple formatting: **bold** and *italic* */
function formatText(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // newlines
  html = html.replace(/\n/g, '<br>')
  return html
}

const formattedText = computed(() => formatText(props.message.text))
</script>

<template>
  <div
    class="bubble"
    :class="message.incoming ? 'bubble--in' : 'bubble--out'"
  >
    <div class="bubble__text" v-html="formattedText"></div>
    <span class="bubble__time">{{ time }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.bubble {
  display: flex;
  flex-direction: column;
  max-width: 70%;
  padding: 10px 14px;
  border-radius: $border-radius;
  animation: fadeSlideIn 0.3s ease;
  word-break: break-word;

  &--in {
    align-self: flex-start;
    background: $color-msg-in;
    border-bottom-left-radius: 4px;
  }

  &--out {
    align-self: flex-end;
    background: $color-msg-out;
    border-bottom-right-radius: 4px;
  }

  &__text {
    font-size: 14px;
    line-height: 1.45;
  }

  &__time {
    align-self: flex-end;
    font-size: 11px;
    color: $color-text-muted;
    margin-top: 4px;
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
