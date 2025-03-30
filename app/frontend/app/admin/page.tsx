"use client"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Store,
  Star,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the IntelliBiz admin dashboard.</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            Download Report
          </Button>
          <Button className="w-full sm:w-auto">View Analytics</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold">1,248</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Store className="h-5 w-5 text-primary" />
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
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">8,549</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
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
                <p className="text-2xl font-bold">4,827</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">24%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">12,938</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">18%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Pending Approvals</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/admin/businesses?filter=pending">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Recently registered businesses awaiting approval</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Quick Plumbing Solutions",
                      category: "Plumbing",
                      date: "2023-03-15",
                      status: "pending",
                    },
                    {
                      name: "Elite Electrical Services",
                      category: "Electrical",
                      date: "2023-03-14",
                      status: "pending",
                    },
                    {
                      name: "Green Gardens Landscaping",
                      category: "Landscaping",
                      date: "2023-03-13",
                      status: "pending",
                    },
                    {
                      name: "Sparkle Home Cleaning",
                      category: "Cleaning",
                      date: "2023-03-12",
                      status: "pending",
                    },
                  ].map((business) => (
                    <TableRow key={business.name}>
                      <TableCell className="font-medium">{business.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{business.category}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(business.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200 whitespace-nowrap"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" className="h-8 px-2 text-xs" asChild>
                          <Link href={`/admin/businesses/review`}>Review</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/admin/activity">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Latest actions and events on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "approval",
                  user: "Admin",
                  action: "Approved business registration",
                  target: "City Plumbers Inc.",
                  time: "10 minutes ago",
                  icon: CheckCircle,
                  iconClass: "text-green-500",
                },
                {
                  type: "flag",
                  user: "Moderator",
                  action: "Flagged review for moderation",
                  target: "Elite Electrical Services",
                  time: "45 minutes ago",
                  icon: AlertTriangle,
                  iconClass: "text-yellow-500",
                },
                {
                  type: "rejection",
                  user: "Admin",
                  action: "Rejected business registration",
                  target: "Fake Business LLC",
                  time: "2 hours ago",
                  icon: AlertTriangle,
                  iconClass: "text-red-500",
                },
                {
                  type: "update",
                  user: "System",
                  action: "Updated category listings",
                  target: "All businesses",
                  time: "5 hours ago",
                  icon: TrendingUp,
                  iconClass: "text-blue-500",
                },
                {
                  type: "approval",
                  user: "Admin",
                  action: "Approved business registration",
                  target: "Green Gardens Landscaping",
                  time: "1 day ago",
                  icon: CheckCircle,
                  iconClass: "text-green-500",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`p-2 rounded-full bg-muted ${activity.iconClass} flex-shrink-0`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.user} {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">{activity.target}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Businesses */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Top Performing Businesses</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/admin/analytics/businesses">
                  View Report <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
            <CardDescription>Businesses with highest engagement and ratings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Bookings</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      name: "Smith Plumbing Services",
                      category: "Plumbing",
                      rating: 4.9,
                      bookings: 156,
                      growth: 24,
                      positive: true,
                    },
                    {
                      name: "Elite Electrical Solutions",
                      category: "Electrical",
                      rating: 4.8,
                      bookings: 142,
                      growth: 18,
                      positive: true,
                    },
                    {
                      name: "Green Thumb Landscaping",
                      category: "Landscaping",
                      rating: 4.7,
                      bookings: 128,
                      growth: 15,
                      positive: true,
                    },
                    {
                      name: "Precision Auto Repair",
                      category: "Automotive",
                      rating: 4.6,
                      bookings: 112,
                      growth: -3,
                      positive: false,
                    },
                    {
                      name: "Sparkle Cleaning Services",
                      category: "Cleaning",
                      rating: 4.5,
                      bookings: 98,
                      growth: 12,
                      positive: true,
                    },
                  ].map((business) => (
                    <TableRow key={business.name}>
                      <TableCell className="font-medium">{business.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{business.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          {business.rating}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{business.bookings}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {business.positive ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span
                            className={business.positive ? "text-green-500 font-medium" : "text-red-500 font-medium"}
                          >
                            {business.positive ? "+" : ""}
                            {business.growth}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-lg md:text-xl">Recent Reviews</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/admin/reviews">
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
                  user: "John D.",
                  business: "Smith Plumbing Services",
                  rating: 5,
                  comment: "Excellent service! Fixed my issue quickly and professionally.",
                  time: "2 hours ago",
                },
                {
                  user: "Sarah M.",
                  business: "Elite Electrical Solutions",
                  rating: 4,
                  comment: "Good work but arrived a bit late. Otherwise very professional.",
                  time: "5 hours ago",
                },
                {
                  user: "Michael T.",
                  business: "Green Thumb Landscaping",
                  rating: 5,
                  comment: "Transformed my garden completely. Very satisfied with the results!",
                  time: "1 day ago",
                },
                {
                  user: "Emily R.",
                  business: "Sparkle Cleaning Services",
                  rating: 3,
                  comment: "Decent cleaning but missed some spots. Had to point them out.",
                  time: "1 day ago",
                },
              ].map((review, i) => (
                <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback>{review.user[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{review.user}</p>
                        <p className="text-xs text-muted-foreground">{review.business}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
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

