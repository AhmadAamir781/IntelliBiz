"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useBusinessMessages } from "@/hooks/useBusinessMessages"
import { toast } from "sonner"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

export default function MessagesPage() {
  const params = useParams()
  const businessId = Number(params.id)
  const { conversations, messages, loading, error, selectedConversation, setSelectedConversation, sendMessage, markAsRead } = useBusinessMessages(businessId)

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConversation || !newMessage.trim()) return

    try {
      await sendMessage(selectedConversation, newMessage)
      setNewMessage("")
    } catch (err) {
      console.error("Failed to send message:", err)
      toast.error("Failed to send message")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Manage your business messages and conversations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Select a conversation to view messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-muted-foreground">No conversations yet</p>
              ) : (
                conversations.map((conversation) => (
                  <Button
                    key={conversation.userId}
                    variant={selectedConversation === conversation.userId ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedConversation(conversation.userId)
                      markAsRead(conversation.userId)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium">{conversation.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="ml-auto bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>
                  </Button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              {selectedConversation
                ? `Conversation with ${conversations.find(c => c.userId === selectedConversation)?.name}`
                : "Select a conversation to view messages"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedConversation ? (
              <div className="flex flex-col h-[600px]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages
                    .filter(m => m.userId === selectedConversation)
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromBusiness ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.isFromBusiness
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(message.createdAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit">Send</Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                Select a conversation to view messages
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
