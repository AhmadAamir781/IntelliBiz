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
import { useDashboard } from "@/hooks/useDashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { any } from "zod"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  debugger
  const { data, loading, error } = useDashboard()

  if (error) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <DashboardSidebar activeItem="dashboard" />
        <div className="flex-1 p-4 md:p-6">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

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
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalAppointments || 0}</p>
                        )}
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    {loading ? (
                      <Skeleton className="h-4 w-24 mt-2" />
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">
                        {data?.stats.confirmedAppointments || 0} confirmed
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Messages</p>
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalMessages || 0}</p>
                        )}
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    {loading ? (
                      <Skeleton className="h-4 w-24 mt-2" />
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">
                        {data?.stats.unreadMessages || 0} unread
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Favorites</p>
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalFavorites || 0}</p>
                        )}
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    loading ? (
                      <Skeleton className="h-4 w-24 mt-2" />
                    ) 
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalReviews || 0}</p>
                        )}
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    {loading ? (
                      <Skeleton className="h-4 w-24 mt-2" />
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">
                        {data?.stats.averageRating.toFixed(1)} average rating
                      </p>
                    )}
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
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : data?.appointments.length ? (
                    <div className="space-y-4">
                      {data.appointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.businessId}</p>
                              <p className="text-sm text-muted-foreground">{appointment.serviceId}</p>
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
                            {appointment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent interactions with businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                          <Skeleton className="h-12 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : data?.recentActivity.length ? (
                    <div className="space-y-4">
                      {data.recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              {activity.type === "appointment" && <Calendar className="h-4 w-4 text-primary" />}
                              {activity.type === "message" && <MessageSquare className="h-4 w-4 text-primary" />}
                              {activity.type === "review" && <Star className="h-4 w-4 text-primary" />}
                              {activity.type === "favorite" && <Heart className="h-4 w-4 text-primary" />}
                            </div>
                            <div>
                              <p className="font-medium">{activity.businessName}</p>
                              <p className="text-sm text-muted-foreground">{activity.action}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs content will be added here */}
          </Tabs>
        </main>
      </div>
    </div>
  )
}
