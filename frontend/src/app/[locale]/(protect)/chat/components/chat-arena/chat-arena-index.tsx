"use client"


import { useState } from "react"
import { Chat } from "./chat-ui"


import { type Message } from "@/registry/new-york-v4/ui/chat-message"
interface ChatSubmitEvent {
    preventDefault?: () => void
  }

interface ChatSubmitOptions {
    experimental_attachments?: FileList
  }

type ChatSubmitHandler = (
    event?: ChatSubmitEvent,
    options?: ChatSubmitOptions
  ) => void
export default function ChatIndex() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (
    event?: ChatSubmitEvent,
    options?: { experimental_attachments?: FileList }
  ) => {
    event?.preventDefault?.()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsGenerating(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, input }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: data.id,
        role: "assistant",
        content: data.content,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Failed to get response", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Chat
      messages={messages}
      handleSubmit={handleSubmit}
      input={input}
      handleInputChange={handleInputChange}
      isGenerating={isGenerating}
      setMessages={setMessages}
      className="w-full h-full"
    />
  )
}
