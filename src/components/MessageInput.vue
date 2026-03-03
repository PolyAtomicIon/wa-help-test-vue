<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  send: [text: string]
}>()

const text = ref('')

function handleSend() {
  const trimmed = text.value.trim()
  if (!trimmed) return
  emit('send', trimmed)
  text.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="msg-input">
    <textarea
      v-model="text"
      class="msg-input__field"
      placeholder="Введите сообщение…"
      rows="1"
      @keydown="handleKeydown"
    ></textarea>
    <button
      class="msg-input__btn"
      :disabled="!text.trim()"
      @click="handleSend"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor" />
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.msg-input {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 12px 16px;
  background: $color-surface;
  border-top: 1px solid $color-border;
  flex-shrink: 0;

  &__field {
    flex: 1;
    resize: none;
    border: none;
    outline: none;
    background: $color-input-bg;
    color: $color-text;
    font-family: $font-family;
    font-size: 14px;
    padding: 10px 14px;
    border-radius: 20px;
    min-height: 40px;
    max-height: 120px;
    line-height: 1.4;

    &::placeholder {
      color: $color-text-muted;
    }
  }

  &__btn {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: $color-accent;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity $transition-speed, transform $transition-speed;

    &:hover:not(:disabled) {
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
