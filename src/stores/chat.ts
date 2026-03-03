import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Chat, Message, User } from '@/types'

const STORAGE_KEY = 'messenger-chats'

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function randomTime(base: number, range: number): number {
  return base - Math.floor(Math.random() * range)
}

const sampleTexts = [
  'Привет! Как дела?',
  'Что нового?',
  'Сегодня отличная погода!',
  'Ты видел последние новости?',
  'Давай встретимся завтра.',
  'Окей, договорились!',
  'Я сейчас занят, напишу позже.',
  'Это действительно круто!',
  'Спасибо за помощь!',
  'Как прошёл твой день?',
  'Нужно обсудить один вопрос.',
  'Отлично, жду!',
  'Не забудь про встречу.',
  'Посмотри это видео — тебе понравится.',
  'Уже на месте?',
  'Перезвони, когда будет время.',
  'Ладно, до связи!',
  'Хорошо, принято!',
  'Вот что я думаю по этому поводу...',
  'Только что вернулся домой.',
  'Завтра будет интересный день.',
  'Не переживай, всё получится!',
  'Слушай, у меня идея!',
  'Подожди минутку.',
  'Звучит как план!',
  'Работаю над проектом.',
  'Как у тебя с этим делом?',
  'Я согласен.',
  'Давай обсудим это вечером.',
  'Классно провели время!'
]

function generateMessages(chatId: number, count: number): Message[] {
  const messages: Message[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    messages.push({
      id: uid(),
      chatId,
      text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)]!,
      incoming: Math.random() > 0.4,
      timestamp: randomTime(now, 86400000 * 3) + i * 60000
    })
  }
  messages.sort((a, b) => a.timestamp - b.timestamp)
  return messages
}

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([])
  const activeChatId = ref<number | null>(null)
  const loaded = ref(false)

  const activeChat = computed(() =>
    chats.value.find((c) => c.id === activeChatId.value) ?? null
  )

  const sortedChats = computed(() => {
    return [...chats.value].sort((a, b) => {
      const lastA = a.messages.length ? a.messages[a.messages.length - 1]!.timestamp : 0
      const lastB = b.messages.length ? b.messages[b.messages.length - 1]!.timestamp : 0
      return lastB - lastA
    })
  })

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.value))
  }

  function loadFromStorage(): boolean {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        chats.value = JSON.parse(raw) as Chat[]
        return true
      } catch {
        return false
      }
    }
    return false
  }

  async function fetchUsers(): Promise<User[]> {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const users: User[] = await res.json()
    return users.slice(0, 5)
  }

  async function init() {
    if (loaded.value) return
    if (loadFromStorage()) {
      loaded.value = true
      return
    }
    const users = await fetchUsers()
    chats.value = users.map((user) => ({
      id: user.id,
      user,
      messages: generateMessages(user.id, 20 + Math.floor(Math.random() * 11)),
      online: Math.random() > 0.5,
      unread: 0
    }))
    saveToStorage()
    loaded.value = true
  }

  function setActiveChat(id: number | null) {
    activeChatId.value = id
    if (id !== null) {
      const chat = chats.value.find((c) => c.id === id)
      if (chat) {
        chat.unread = 0
        // Randomly toggle online status for demo
        if (Math.random() > 0.5) {
          chat.online = !chat.online
        }
        saveToStorage()
      }
    }
  }

  function sendMessage(chatId: number, text: string) {
    const chat = chats.value.find((c) => c.id === chatId)
    if (!chat) return

    const msg: Message = {
      id: uid(),
      chatId,
      text,
      incoming: false,
      timestamp: Date.now()
    }
    chat.messages.push(msg)
    saveToStorage()

    // Emulate auto-reply after 1-2 seconds
    const delay = 1000 + Math.random() * 1000
    setTimeout(() => {
      const reply: Message = {
        id: uid(),
        chatId,
        text: 'Спасибо за сообщение!)',
        incoming: true,
        timestamp: Date.now()
      }
      chat.messages.push(reply)
      if (activeChatId.value !== chatId) {
        chat.unread++
      }
      saveToStorage()
    }, delay)
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY)
    chats.value = []
    activeChatId.value = null
    loaded.value = false
  }

  return {
    chats,
    activeChatId,
    loaded,
    activeChat,
    sortedChats,
    init,
    setActiveChat,
    sendMessage,
    resetData
  }
})
