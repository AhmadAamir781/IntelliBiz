"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Image, Smile } from "lucide-react"

interface Message {
  id: string
  sender: "user" | "business"
  text: string
  timestamp: Date
}

interface MessageDialogProps {
  businessName: string
  businessId: number
  businessAvatar?: string
  trigger: React.ReactNode
}

export function MessageDialog({ businessName, businessId, businessAvatar, trigger }: MessageDialogProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "business",
      text: `Hello! Thanks for reaching out to ${businessName}. How can we help you today?`,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, open])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate business response after a delay
    setTimeout(() => {
      const responses = [
        "Thank you for your message. We'll get back to you as soon as possible.",
        "We appreciate your inquiry. How else can we assist you?",
        "Thanks for reaching out! We'd be happy to help with that.",
        "Great question! Let me check with our team and get back to you shortly.",
        "We can definitely help with that. When would be a good time to discuss further?",
      ]

      const businessResponse: Message = {
        id: Date.now().toString(),
        sender: "business",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, businessResponse])
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button variant="outline">Message</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[90vh] sm:h-[600px] flex flex-col p-0">
        <DialogHeader className="px-4 py-2 border-b shrink-0">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={businessAvatar || "/placeholder.svg?height=40&width=40"} alt={businessName} />
              {/* <AvatarFallback>{businessName.charAt(0)}</AvatarFallback> */}
            </Avatar>
            <DialogTitle className="text-base">{businessName}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="break-words">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-2 sm:p-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1">
              <Button variant="ghost" size="icon" type="button" className="rounded-full h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" type="button" className="rounded-full h-8 w-8">
                <Image className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" type="button" className="rounded-full h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1"
              ref={inputRef}
            />
            <Button
              size="icon"
              type="button"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
