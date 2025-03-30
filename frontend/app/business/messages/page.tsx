"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, Image, Smile, MessageSquare } from "lucide-react"

interface Message {
  id: string
  sender: "business" | "customer"
  content: string
  timestamp: Date
  read: boolean
}

interface Conversation {
  id: string
  customer: {
    id: string
    name: string
    avatar: string
  }
  lastMessage: {
    content: string
    timestamp: Date
    read: boolean
  }
  messages: Message[]
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      customer: {
        id: "c1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: {
        content: "Hi, I'm having an issue with my kitchen sink. Can you help?",
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        read: false,
      },
      messages: [
        {
          id: "m1",
          sender: "customer",
          content: "Hi, I'm having an issue with my kitchen sink. Can you help?",
          timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          read: false,
        },
      ],
    },
    {
      id: "2",
      customer: {
        id: "c2",
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: {
        content: "Thanks for the quick service yesterday. Everything is working great now!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
      messages: [
        {
          id: "m2",
          sender: "customer",
          content: "Hi, I need someone to fix my leaking faucet. Are you available tomorrow?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          read: true,
        },
        {
          id: "m3",
          sender: "business",
          content: "Hello Sarah, yes we're available tomorrow. Would 10 AM work for you?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
          read: true,
        },
        {
          id: "m4",
          sender: "customer",
          content: "10 AM works perfectly. Thank you!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
          read: true,
        },
        {
          id: "m5",
          sender: "business",
          content: "Great! We'll see you tomorrow at 10 AM. Please have your faucet accessible.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21), // 21 hours ago
          read: true,
        },
        {
          id: "m6",
          sender: "customer",
          content: "Thanks for the quick service yesterday. Everything is working great now!",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: false,
        },
      ],
    },
    {
      id: "3",
      customer: {
        id: "c3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: {
        content: "I need to reschedule my appointment for next week. Is that possible?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: false,
      },
      messages: [
        {
          id: "m7",
          sender: "customer",
          content: "I need to reschedule my appointment for next week. Is that possible?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          read: false,
        },
      ],
    },
    {
      id: "4",
      customer: {
        id: "c4",
        name: "Emily Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastMessage: {
        content: "Do you offer water heater installation services?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
      messages: [
        {
          id: "m8",
          sender: "customer",
          content: "Do you offer water heater installation services?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
        },
        {
          id: "m9",
          sender: "business",
          content: "Yes, we do offer water heater installation services. Would you like to schedule an appointment?",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23), // 23 hours ago
          read: true,
        },
      ],
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return conversation.customer.name.toLowerCase().includes(query)
    }
    return true
  })

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedConversation])

  const handleSelectConversation = (conversation: Conversation) => {
    // Mark all messages as read when selecting a conversation
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === conversation.id) {
        const updatedMessages = conv.messages.map((msg) => ({
          ...msg,
          read: true,
        }))
        return {
          ...conv,
          lastMessage: {
            ...conv.lastMessage,
            read: true,
          },
          messages: updatedMessages,
        }
      }
      return conv
    })

    setConversations(updatedConversations)
    setSelectedConversation(updatedConversations.find((conv) => conv.id === conversation.id) || null)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: "business",
      content: newMessage,
      timestamp: new Date(),
      read: true,
    }

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: {
            content: newMessage,
            timestamp: new Date(),
            read: true,
          },
          messages: [...conv.messages, newMsg],
        }
      }
      return conv
    })

    setConversations(updatedConversations)
    setSelectedConversation(updatedConversations.find((conv) => conv.id === selectedConversation.id) || null)
    setNewMessage("")

    // Scroll to bottom after sending message
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      return date.toLocaleDateString()
    }
  }

  const getUnreadCount = () => {
    return conversations.reduce((count, conv) => {
      return count + (conv.lastMessage.read ? 0 : 1)
    }, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with your customers.</p>
      </div>

      <Card className="h-[calc(100vh-220px)] min-h-[500px]">
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-full md:w-1/3 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No conversations found</div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.customer.avatar} alt={conversation.customer.name} />
                        <AvatarFallback>{conversation.customer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{conversation.customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                      </div>
                      {!conversation.lastMessage.read && (
                        <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-xs">•</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Conversation Detail */}
          <div className="hidden md:flex flex-col w-2/3 h-full">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedConversation.customer.avatar}
                        alt={selectedConversation.customer.name}
                      />
                      <AvatarFallback>{selectedConversation.customer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedConversation.customer.name}</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "business" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "business" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "business" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" type="button" className="rounded-full">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" className="rounded-full">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" type="button" className="rounded-full">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-muted rounded-full p-4 inline-block mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-muted-foreground mt-1">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

