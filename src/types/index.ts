export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  company: { name: string }
}

export interface Message {
  id: string
  chatId: number
  text: string
  incoming: boolean
  timestamp: number
}

export interface Chat {
  id: number
  user: User
  messages: Message[]
  online: boolean
  unread: number
}
