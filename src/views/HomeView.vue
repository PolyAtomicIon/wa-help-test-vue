<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import ChatList from '@/components/ChatList.vue'
import ChatWindow from '@/components/ChatWindow.vue'

const store = useChatStore()
const router = useRouter()

onMounted(() => {
  store.init()
})

function handleSelectChat(id: number) {
  store.setActiveChat(id)
  // On mobile, navigate to the chat route
  if (window.innerWidth <= 768) {
    router.push({ name: 'chat', params: { id: String(id) } })
  }
}
</script>

<template>
  <div class="home">
    <ChatList @select="handleSelectChat" />
    <ChatWindow :chat="store.activeChat" class="home__chat-desktop" />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.home {
  display: flex;
  height: 100%;

  &__chat-desktop {
    @media (max-width: $mobile-breakpoint) {
      display: none;
    }
  }
}
</style>
