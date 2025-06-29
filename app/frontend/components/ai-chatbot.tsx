"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MessageSquare, Send, X, Loader2, Bot, MapPin, Star, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useChat, Message } from "ai/react"

// Sample quick prompts for users to click on
const quickPrompts = [
  "Find me the best plumber for my tap",
  "Show newly registered plumbers",
  "Find a plumber near me",
  "What services does IntelliBiz offer?",
  "How can I register my business?",
  "Tell me about IntelliBiz",
]

// Enhanced sample business data for demonstration
const sampleBusinesses = [
  {
    id: "1",
    name: "Smith Plumbing Services",
    category: "Plumbing",
    rating: 4.8,
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-01-15",
    specialties: ["Tap Repair", "Pipe Installation", "Drain Cleaning"],
    verified: true,
  },
  {
    id: "2",
    name: "Elite Electrical Solutions",
    category: "Electrical",
    rating: 4.6,
    location: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-02-20",
    specialties: ["Wiring", "Lighting", "Electrical Repairs"],
    verified: true,
  },
  {
    id: "3",
    name: "Green Thumb Landscaping",
    category: "Landscaping",
    rating: 4.9,
    location: "Queens, NY",
    image: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-03-10",
    specialties: ["Lawn Care", "Garden Design", "Tree Trimming"],
    verified: false,
  },
  {
    id: "4",
    name: "Precision Auto Repair",
    category: "Automotive",
    rating: 4.7,
    location: "Bronx, NY",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-04-05",
    specialties: ["Engine Repair", "Brake Service", "Oil Change"],
    verified: true,
  },
  {
    id: "5",
    name: "Sparkle Cleaning Services",
    category: "Cleaning",
    rating: 4.5,
    location: "Manhattan, NY",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-05-12",
    specialties: ["Home Cleaning", "Office Cleaning", "Deep Cleaning"],
    verified: true,
  },
  {
    id: "6",
    name: "Master Carpentry",
    category: "Carpentry",
    rating: 4.8,
    location: "Staten Island, NY",
    image: "https://images.unsplash.com/photo-1601564921647-b446839a013f?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-06-18",
    specialties: ["Custom Furniture", "Cabinet Making", "Wood Repairs"],
    verified: false,
  },
  {
    id: "7",
    name: "Quick Fix Plumbing",
    category: "Plumbing",
    rating: 4.6,
    location: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-10-05",
    specialties: ["Emergency Repairs", "Tap Installation", "Leak Detection"],
    verified: true,
  },
  {
    id: "8",
    name: "Pro Plumbing Solutions",
    category: "Plumbing",
    rating: 4.9,
    location: "Manhattan, NY",
    image: "https://images.unsplash.com/photo-1594741158704-a1195bde5b7e?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-11-20",
    specialties: ["Bathroom Remodeling", "Tap Repair", "Water Heater Installation"],
    verified: true,
  },
  {
    id: "9",
    name: "Rapid Plumbing Services",
    category: "Plumbing",
    rating: 4.7,
    location: "Queens, NY",
    image: "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?q=80&w=600&auto=format&fit=crop",
    registrationDate: "2023-12-15",
    specialties: ["Tap Repair", "Toilet Installation", "Pipe Repair"],
    verified: false,
  },
]

// Get current date for "newly registered" calculations
const currentDate = new Date()
const threeMonthsAgo = new Date()
threeMonthsAgo.setMonth(currentDate.getMonth() - 3)

// Helper function to check if a business is newly registered (within the last 3 months)
function isNewlyRegistered(dateString: string): boolean {
  const registrationDate = new Date(dateString)
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  return registrationDate > threeMonthsAgo
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set())
  const [businessRotationIndex, setBusinessRotationIndex] = useState(0)
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    businesses?: any[];
  }>>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi there! I'm IntelliBiz AI assistant. How can I help you find local businesses or answer questions about our platform today?",
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock AI response function
  const generateMockResponse = (userMessage: string) => {
    const query = userMessage.toLowerCase()
    
    if (query.includes("plumber") || query.includes("plumbing")) {
      return "Here are some great plumbing services that might help with your request:"
    } else if (query.includes("electrician") || query.includes("electrical")) {
      return "I found some excellent electrical services for you:"
    } else if (query.includes("find") || query.includes("show")) {
      return "Here are some businesses that match your search:"
    } else if (query.includes("help") || query.includes("what")) {
      return "I can help you find local businesses, answer questions about IntelliBiz, or assist with business registration. What would you like to know?"
    } else {
      return "I understand you're looking for local services. Let me help you find the right businesses for your needs:"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: userMessage
    }
    setMessages(prev => [...prev, newUserMessage])

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = generateMockResponse(userMessage)
      const newAiMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: aiResponse
      }
      setMessages(prev => [...prev, newAiMessage])
      setIsLoading(false)
      
      // Process business query after response
      processBusinessQuery(userMessage)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // Process business queries to find relevant businesses
  const processBusinessQuery = (query: string) => {
    // Get the last assistant message ID
    const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
    if (!lastAssistantMessage) return

    // Skip if we've already processed this message
    if (processedMessageIds.has(lastAssistantMessage.id)) {
      return
    }

    // Check if the query is about finding businesses
    const isBusinessQuery =
      query.includes("find") ||
      query.includes("show") ||
      query.includes("best") ||
      query.includes("near me") ||
      query.includes("plumber") ||
      query.includes("electrician") ||
      query.includes("service")

    if (!isBusinessQuery) return

    // Extract specific requirements from the query
    const isNewlyRegistered = query.includes("new") || query.includes("newly") || query.includes("recent")

    const isBestRated = query.includes("best") || query.includes("top") || query.includes("highest rated")

    const isNearMe = query.includes("near me") || query.includes("nearby") || query.includes("close")

    // Extract business categories mentioned
    const categories = [
      { name: "plumbing", keywords: ["plumber", "plumbing", "tap", "pipe", "leak", "drain"] },
      { name: "electrical", keywords: ["electrician", "electrical", "wiring", "power"] },
      { name: "landscaping", keywords: ["landscaping", "garden", "lawn"] },
      { name: "automotive", keywords: ["auto", "car", "vehicle", "repair"] },
      { name: "cleaning", keywords: ["cleaning", "cleaner", "maid"] },
      { name: "carpentry", keywords: ["carpentry", "carpenter", "wood", "furniture"] },
    ]

    let matchedCategories: string[] = []

    for (const category of categories) {
      if (category.keywords.some((keyword) => query.includes(keyword))) {
        matchedCategories.push(category.name)
      }
    }

    // If no categories matched but it's a business query, default to all categories
    if (matchedCategories.length === 0 && isBusinessQuery) {
      matchedCategories = categories.map((c) => c.name)
    }

    // Filter businesses based on matched categories
    let filteredBusinesses = sampleBusinesses.filter((business) =>
      matchedCategories.some((cat) => business.category.toLowerCase().includes(cat)),
    )

    // Apply additional filters based on query
    if (isNewlyRegistered) {
      filteredBusinesses = filteredBusinesses.filter((business) => {
        const regDate = new Date(business.registrationDate)
        return regDate > threeMonthsAgo
      })
    }

    // For "tap" specific queries
    if (query.includes("tap")) {
      filteredBusinesses = filteredBusinesses.filter((business) =>
        business.specialties.some((s) => s.toLowerCase().includes("tap")),
      )
    }

    // Sort by rating if "best" is mentioned
    if (isBestRated) {
      filteredBusinesses.sort((a, b) => b.rating - a.rating)
    }

    // For near me, we would normally use geolocation
    // For demo purposes, just prioritize Manhattan and Brooklyn
    if (isNearMe) {
      filteredBusinesses.sort((a, b) => {
        const aScore = a.location.includes("Manhattan") ? 2 : a.location.includes("Brooklyn") ? 1 : 0
        const bScore = b.location.includes("Manhattan") ? 2 : b.location.includes("Brooklyn") ? 1 : 0
        return bScore - aScore
      })
    }

    // Rotate through different businesses to provide variety
    const rotationSize = 3 // Show 3 businesses at a time
    const startIndex = (businessRotationIndex * rotationSize) % Math.max(filteredBusinesses.length, 1)
    const endIndex = startIndex + rotationSize
    
    // Get rotated subset of businesses
    let rotatedBusinesses = filteredBusinesses.slice(startIndex, endIndex)
    
    // If we don't have enough businesses after rotation, wrap around
    if (rotatedBusinesses.length < rotationSize && filteredBusinesses.length > rotationSize) {
      const remaining = rotationSize - rotatedBusinesses.length
      rotatedBusinesses = [...rotatedBusinesses, ...filteredBusinesses.slice(0, remaining)]
    }
    
    // If still no businesses, use the original filtered list
    if (rotatedBusinesses.length === 0) {
      rotatedBusinesses = filteredBusinesses.slice(0, 3)
    }

    // Update rotation index for next time
    setBusinessRotationIndex(prev => prev + 1)

    // Add business recommendations to the last assistant message
    if (rotatedBusinesses.length > 0) {
      // Mark this message as processed to prevent infinite loops
      setProcessedMessageIds((prev) => new Set(prev).add(lastAssistantMessage.id))

      // Update the message with businesses
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages]
        const lastAssistantIndex = updatedMessages.findIndex((m) => m.id === lastAssistantMessage.id)

        if (lastAssistantIndex !== -1) {
          updatedMessages[lastAssistantIndex] = {
            ...updatedMessages[lastAssistantIndex],
            businesses: rotatedBusinesses,
          } as any
        }

        return updatedMessages
      })
    }
  }

  // Scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      if (inputRef.current && messages.length === 1) {
        inputRef.current.focus()
      }
    }
  }, [messages, isOpen])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleQuickPrompt = (prompt: string) => {
    // Set the input value
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)

    // Small delay to show the input being filled
    setTimeout(() => {
      // Create a synthetic form event
      const formEvent = new Event("submit", { cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>
      handleSubmit(formEvent)
    }, 300)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <Card className="mb-2 w-[350px] sm:w-[400px] shadow-lg border-primary/10 overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">IntelliBiz Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-primary-foreground h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[350px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-2 max-w-[85%]">
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {/* Quick prompts - show only after the welcome message */}
                      {message.id === "welcome" && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {quickPrompts.slice(0, 3).map((prompt, index) => (
                            <button
                              key={index}
                              className="text-xs bg-muted/50 hover:bg-muted px-2 py-1 rounded-full border text-muted-foreground"
                              onClick={() => handleQuickPrompt(prompt)}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Business recommendations */}
                      {(message as any).businesses && (message as any).businesses.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {(message as any).businesses.map((business: any) => (
                            <Link href={`/businesses/${business.id}`} key={business.id}>
                              <div className="flex gap-2 p-2 rounded-lg hover:bg-muted/80 transition-colors border">
                                <div className="h-12 w-12 rounded-md overflow-hidden">
                                  <img
                                    src={business.image || "/placeholder.svg"}
                                    alt={business.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-sm truncate">{business.name}</h4>
                                    {business.verified && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs px-1 py-0 h-4 bg-green-50 text-green-700 border-green-200"
                                      >
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                                      {business.category}
                                    </Badge>
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                      <span className="ml-0.5">{business.rating}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                    <MapPin className="h-3 w-3 mr-0.5" />
                                    <span className="truncate">{business.location}</span>
                                  </div>
                                  {isNewlyRegistered(business.registrationDate) && (
                                    <div className="flex items-center text-xs text-blue-600 mt-0.5">
                                      <Clock className="h-3 w-3 mr-0.5" />
                                      <span className="truncate">Newly Registered</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32&text=AI" alt="AI" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={handleInputChange}
                className="flex-1"
                disabled={isLoading}
                ref={inputRef}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} data-chatbot-button>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button
        onClick={toggleChat}
        className={`rounded-full h-14 w-14 shadow-lg ${
          isOpen ? "bg-muted hover:bg-muted/90" : "bg-primary hover:bg-primary/90"
        }`}
        size="icon"
        data-chatbot-button
      >
        {isOpen ? (
          <X className={`h-6 w-6 ${isOpen ? "text-foreground" : "text-primary-foreground"}`} />
        ) : (
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        )}
      </Button>
    </div>
  )
}
