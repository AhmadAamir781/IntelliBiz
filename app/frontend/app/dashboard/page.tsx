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

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { data, loading, error } = useDashboard()

  if (error) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <DashboardSidebar activeItem="dashboard" />
        <div className="flex-1 p-6 md:p-8">
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar activeItem="dashboard" />

      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Dashboard" />

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-3 p-1">
              <TabsTrigger value="overview" className="font-medium">Overview</TabsTrigger>
              <TabsTrigger value="appointments" className="font-medium">Appointments</TabsTrigger>
              <TabsTrigger value="messages" className="font-medium">Messages</TabsTrigger>
              <TabsTrigger value="favorites" className="font-medium">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Appointments</p>
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalAppointments || 0}</p>
                        )}
                      </div>
                      <div className="p-2.5 bg-primary/10 rounded-full">
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

                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Messages</p>
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalMessages || 0}</p>
                        )}
                      </div>
                      <div className="p-2.5 bg-primary/10 rounded-full">
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

                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Favorites</p>
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalFavorites || 0}</p>
                        )}
                      </div>
                      <div className="p-2.5 bg-primary/10 rounded-full">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    {loading ? (
                      <Skeleton className="h-4 w-24 mt-2" />
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">
                        Businesses you've favorited
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Reviews</p>
                        {loading ? (
                          <Skeleton className="h-8 w-16 mt-1" />
                        ) : (
                          <p className="text-2xl font-bold">{data?.stats.totalReviews || 0}</p>
                        )}
                      </div>
                      <div className="p-2.5 bg-primary/10 rounded-full">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    {loading ? (
                      <Skeleton className="h-4 w-24 mt-2" />
                    ) : (
                      <p className="text-xs text-muted-foreground mt-2">
                        {data?.stats.averageRating?.toFixed(1) || "0.0"} average rating
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3 px-6 pt-6">
                  <CardTitle className="text-xl font-semibold">Upcoming Appointments</CardTitle>
                  <CardDescription className="mt-1">Your scheduled appointments with service providers</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {loading ? (
                    <div className="space-y-5">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-5 last:border-0 last:pb-0">
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : data?.appointments.length ? (
                    <div className="space-y-5">
                      {data.appointments.slice(0, 2).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between border-b pb-5 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 bg-primary/10 rounded-full">
                              <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.businessId}</p>
                              <p className="text-sm text-muted-foreground">{appointment.serviceId}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-sm">
                                  {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
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
                              appointment.status === "confirmed" 
                                ? "border-green-200 bg-green-50 text-green-700 font-medium" 
                                : "font-medium"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link href="/dashboard/appointments">View All Appointments</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">No upcoming appointments</p>
                      <Button variant="outline" asChild>
                        <Link href="/businesses">Find Services</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3 px-6 pt-6">
                  <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                  <CardDescription className="mt-1">Your recent interactions with businesses</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
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
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-primary/10 rounded-full">
                              {activity.type === "appointment" && <Calendar className="h-4 w-4 text-primary" />}
                              {activity.type === "message" && <MessageSquare className="h-4 w-4 text-primary" />}
                              {activity.type === "review" && <Star className="h-4 w-4 text-primary" />}
                              {activity.type === "favorite" && <Heart className="h-4 w-4 text-primary" />}
                            </div>
                            <div>
                              <p className="font-medium">{activity.businessName}</p>
                              <p className="text-sm text-muted-foreground mt-1">{activity.action}</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card className="shadow-sm">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-xl font-semibold">Appointments</CardTitle>
                  <CardDescription className="mt-1">Manage your upcoming and past appointments</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground">Your appointments will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card className="shadow-sm">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-xl font-semibold">Messages</CardTitle>
                  <CardDescription className="mt-1">View and respond to messages from businesses</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground">Your messages will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card className="shadow-sm">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="text-xl font-semibold">Favorites</CardTitle>
                  <CardDescription className="mt-1">View and manage your favorite businesses</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground">Your favorite businesses will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
