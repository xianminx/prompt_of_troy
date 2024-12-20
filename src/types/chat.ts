export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export interface ChatMessagesProps {
  messages: Message[]
} 