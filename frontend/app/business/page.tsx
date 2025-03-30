"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MessageSquare, Calendar, TrendingUp, Eye, ArrowRight, ArrowUpRight, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function BusinessDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your business dashboard.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/business/profile">Edit Profile</Link>
          </Button>
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/business/services/add">Add Service</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">1,248</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Eye className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">8%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                <p className="text-2xl font-bold">124</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">4.8</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">38</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                3 Unread
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Upcoming Appointments</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/business/appointments">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Your scheduled appointments with customers</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Service</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "John Doe",
                      service: "Pipe Repair",
                      date: "2023-03-20",
                      time: "10:00 AM",
                      status: "confirmed",
                    },
                    {
                      name: "Sarah Miller",
                      service: "Drain Cleaning",
                      date: "2023-03-21",
                      time: "2:30 PM",
                      status: "confirmed",
                    },
                    {
                      name: "Michael Brown",
                      service: "Water Heater Installation",
                      date: "2023-03-22",
                      time: "9:00 AM",
                      status: "pending",
                    },
                    {
                      name: "Emily Wilson",
                      service: "Leak Detection",
                      date: "2023-03-23",
                      time: "11:30 AM",
                      status: "pending",
                    },
                  ].map((appointment) => (
                    <TableRow key={appointment.name}>
                      <TableCell className="font-medium">{appointment.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{appointment.service}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </TableCell>
                      <TableCell>
                        {appointment.status === "confirmed" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 whitespace-nowrap"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Confirmed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200 whitespace-nowrap"
                          >
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8 px-2 text-xs" asChild>
                          <Link href={`/business/appointments/${appointment.date}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Recent Messages</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/business/messages">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Latest messages from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John Doe",
                  message: "Hi, I'm having an issue with my kitchen sink. Can you help?",
                  time: "10 minutes ago",
                  unread: true,
                },
                {
                  name: "Sarah Miller",
                  message: "Thanks for the quick service yesterday. Everything is working great now!",
                  time: "2 hours ago",
                  unread: true,
                },
                {
                  name: "Michael Brown",
                  message: "I need to reschedule my appointment for next week. Is that possible?",
                  time: "5 hours ago",
                  unread: true,
                },
                {
                  name: "Emily Wilson",
                  message: "Do you offer water heater installation services?",
                  time: "1 day ago",
                  unread: false,
                },
              ].map((message, i) => (
                <div key={i} className="flex gap-4">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback>{message.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p className="font-medium">{message.name}</p>
                      <p className="text-xs text-muted-foreground">{message.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{message.message}</p>
                  </div>
                  {message.unread && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Overview */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Performance Overview</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/business/analytics">
                  View Details <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Your business performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
              <TrendingUp className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Performance chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Recent Reviews</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/business/reviews">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Latest customer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "John D.",
                  rating: 5,
                  comment: "Excellent service! Fixed my issue quickly and professionally.",
                  time: "2 days ago",
                },
                {
                  name: "Sarah M.",
                  rating: 4,
                  comment: "Good work but arrived a bit late. Otherwise very professional.",
                  time: "1 week ago",
                },
                {
                  name: "Michael T.",
                  rating: 5,
                  comment: "Very knowledgeable and efficient. Will definitely use again!",
                  time: "2 weeks ago",
                },
              ].map((review, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-medium">{review.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-sm line-clamp-2">{review.comment}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{review.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

