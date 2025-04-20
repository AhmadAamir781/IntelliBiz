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
import { useAdminDashboard } from "@/hooks/useAdminDashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboard() {
  const { stats, pendingBusinesses, recentActivity, loading, error } = useAdminDashboard()

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

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
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalBusinesses || 0}</p>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Store className="h-5 w-5 text-primary" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-24 mt-4" />
            ) : (
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stats?.businessGrowth || 0}%</span>
                <span className="ml-1">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-24 mt-4" />
            ) : (
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stats?.userGrowth || 0}%</span>
                <span className="ml-1">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalReviews || 0}</p>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-5 w-5 text-primary" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-24 mt-4" />
            ) : (
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stats?.reviewGrowth || 0}%</span>
                <span className="ml-1">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                {loading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">{stats?.totalMessages || 0}</p>
                )}
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-24 mt-4" />
            ) : (
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">{stats?.messageGrowth || 0}%</span>
                <span className="ml-1">from last month</span>
              </div>
            )}
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
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : pendingBusinesses.length > 0 ? (
                    pendingBusinesses.map((business) => (
                      <TableRow key={business.id}>
                        <TableCell className="font-medium">{business.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{business.category}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(business.createdAt).toLocaleDateString()}
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
                            <Link href={`/admin/businesses/review/${business.id}`}>Review</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No pending approvals
                      </TableCell>
                    </TableRow>
                  )}
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
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.type === 'approval' ? CheckCircle :
                    activity.type === 'flag' || activity.type === 'rejection' ? AlertTriangle :
                    TrendingUp;
                  const iconClass = activity.type === 'approval' ? 'text-green-500' :
                    activity.type === 'flag' ? 'text-yellow-500' :
                    activity.type === 'rejection' ? 'text-red-500' :
                    'text-blue-500';

                  return (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className={`p-2 bg-primary/10 rounded-full ${iconClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} • {activity.target} • {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
