<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import ChatWindow from '@/components/ChatWindow.vue'

const route = useRoute()
const router = useRouter()
const store = useChatStore()

const chatId = computed(() => Number(route.params.id))
const chat = computed(() => store.chats.find((c) => c.id === chatId.value) ?? null)

onMounted(async () => {
  await store.init()
  store.setActiveChat(chatId.value)
})

function goBack() {
  store.setActiveChat(null)
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="mobile-chat">
    <ChatWindow :chat="chat" show-back @back="goBack" />
  </div>
</template>

<style scoped lang="scss">
.mobile-chat {
  height: 100%;
}
</style>
