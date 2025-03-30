"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Calendar, MessageSquare, Star, Heart, CheckCircle2 } from "lucide-react"

// Mock data for dashboard
const appointments = [
  {
    id: "1",
    businessName: "Smith Plumbing Services",
    date: "2023-06-15",
    time: "10:00 AM",
    status: "confirmed",
    service: "Pipe Repair",
  },
  {
    id: "2",
    businessName: "Elite Electrical Solutions",
    date: "2023-06-18",
    time: "2:30 PM",
    status: "pending",
    service: "Electrical Inspection",
  },
  {
    id: "3",
    businessName: "Green Thumb Landscaping",
    date: "2023-06-22",
    time: "9:00 AM",
    status: "confirmed",
    service: "Lawn Maintenance",
  },
]

const messages = [
  {
    id: "1",
    businessName: "Smith Plumbing Services",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Thanks for your inquiry. We can schedule your appointment for next week.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    businessName: "Elite Electrical Solutions",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Your appointment has been confirmed for June 18th at 2:30 PM.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "3",
    businessName: "Green Thumb Landscaping",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "We've received your payment. Thank you for your business!",
    time: "3 days ago",
    unread: false,
  },
]

const favoriteBusinesses = [
  {
    id: "1",
    name: "Smith Plumbing Services",
    category: "Plumbing",
    rating: 4.8,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Elite Electrical Solutions",
    category: "Electrical",
    rating: 4.6,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Green Thumb Landscaping",
    category: "Landscaping",
    rating: 4.9,
    image: "/placeholder.svg?height=100&width=100",
  },
]

const recentActivity = [
  {
    id: "1",
    type: "appointment",
    businessName: "Smith Plumbing Services",
    action: "Appointment confirmed",
    time: "2 hours ago",
  },
  {
    id: "2",
    type: "message",
    businessName: "Elite Electrical Solutions",
    action: "New message received",
    time: "Yesterday",
  },
  {
    id: "3",
    type: "review",
    businessName: "Green Thumb Landscaping",
    action: "You left a review",
    time: "3 days ago",
  },
  {
    id: "4",
    type: "favorite",
    businessName: "Precision Auto Repair",
    action: "Added to favorites",
    time: "1 week ago",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar activeItem="dashboard" />

      <div className="flex-1">
        <DashboardHeader title="Dashboard" />

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                        <p className="text-2xl font-bold">{appointments.length}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {appointments.filter((a) => a.status === "confirmed").length} confirmed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Messages</p>
                        <p className="text-2xl font-bold">{messages.length}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {messages.filter((m) => m.unread).length} unread
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                        <p className="text-2xl font-bold">{favoriteBusinesses.length}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Across {new Set(favoriteBusinesses.map((b) => b.category)).size} categories
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                        <p className="text-2xl font-bold">12</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">4.7 average rating</p>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled appointments with service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.businessName}</p>
                              <p className="text-sm text-muted-foreground">{appointment.service}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm">
                                  {new Date(appointment.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                                <span className="text-muted-foreground">•</span>
                                <p className="text-sm">{appointment.time}</p>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={appointment.status === "confirmed" ? "outline" : "secondary"}
                            className={
                              appointment.status === "confirmed" ? "border-green-200 bg-green-50 text-green-700" : ""
                            }
                          >
                            {appointment.status === "confirmed" ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Confirmed
                              </span>
                            ) : (
                              "Pending"
                            )}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No upcoming appointments</p>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/appointments">View all appointments</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity and Messages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent interactions with businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex gap-3">
                          <div className="p-2 bg-muted rounded-full h-8 w-8 flex items-center justify-center">
                            {activity.type === "appointment" && <Calendar className="h-4 w-4" />}
                            {activity.type === "message" && <MessageSquare className="h-4 w-4" />}
                            {activity.type === "review" && <Star className="h-4 w-4" />}
                            {activity.type === "favorite" && <Heart className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.businessName}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Your conversations with service providers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {messages.slice(0, 3).map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <Avatar>
                            <AvatarImage src={message.avatar} alt={message.businessName} />
                            <AvatarFallback>{message.businessName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{message.businessName}</p>
                              <p className="text-xs text-muted-foreground">{message.time}</p>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{message.message}</p>
                          </div>
                          {message.unread && <div className="w-2 h-2 rounded-full bg-primary mt-2" />}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link href="/dashboard/messages">View all messages</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Appointments</CardTitle>
                  <CardDescription>Manage your scheduled appointments with service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  {appointments.length > 0 ? (
                    <div className="space-y-6">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.businessName}</p>
                              <p className="text-sm text-muted-foreground">{appointment.service}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm">
                                  {new Date(appointment.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </p>
                                <span className="text-muted-foreground">•</span>
                                <p className="text-sm">{appointment.time}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-4 sm:mt-0">
                            <Badge
                              variant={appointment.status === "confirmed" ? "outline" : "secondary"}
                              className={
                                appointment.status === "confirmed" ? "border-green-200 bg-green-50 text-green-700" : ""
                              }
                            >
                              {appointment.status === "confirmed" ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" />
                                  Confirmed
                                </span>
                              ) : (
                                "Pending"
                              )}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No appointments</h3>
                      <p className="text-muted-foreground mt-2">You don't have any appointments scheduled.</p>
                      <Button className="mt-4" asChild>
                        <Link href="/businesses">Find a business</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Messages</CardTitle>
                  <CardDescription>Conversations with service providers</CardDescription>
                </CardHeader>
                <CardContent>
                  {messages.length > 0 ? (
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div key={message.id} className="flex gap-4 border-b pb-6 last:border-0 last:pb-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.avatar} alt={message.businessName} />
                            <AvatarFallback>{message.businessName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{message.businessName}</p>
                                {message.unread && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{message.time}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{message.message}</p>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm">Reply</Button>
                              <Button variant="outline" size="sm">
                                View Conversation
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No messages</h3>
                      <p className="text-muted-foreground mt-2">You don't have any messages yet.</p>
                      <Button className="mt-4" asChild>
                        <Link href="/businesses">Contact a business</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Favorite Businesses</CardTitle>
                  <CardDescription>Businesses you've saved for quick access</CardDescription>
                </CardHeader>
                <CardContent>
                  {favoriteBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteBusinesses.map((business) => (
                        <Card key={business.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 rounded-md">
                                <AvatarImage src={business.image} alt={business.name} className="object-cover" />
                                <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{business.name}</p>
                                <p className="text-xs text-muted-foreground">{business.category}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs">{business.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" className="flex-1" asChild>
                                <Link href={`/businesses/${business.id}`}>View</Link>
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Contact
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                                <Heart className="h-4 w-4 fill-current" />
                                <span className="sr-only">Remove from favorites</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No favorites</h3>
                      <p className="text-muted-foreground mt-2">
                        You haven't added any businesses to your favorites yet.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/businesses">Browse businesses</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

