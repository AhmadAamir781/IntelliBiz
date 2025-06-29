"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Store, 
  Star, 
  MessageSquare,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Eye,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth();
  const { data: analyticsData, loading, error, isInitialized, fetchAnalyticsData, refreshData } = useAdminAnalytics();
  const [timeRange, setTimeRange] = useState("30d");

  // Memoize authentication check to prevent unnecessary re-renders
  const authCheck = useMemo(() => ({
    isAuthenticated,
    hasRole: hasRole('Admin'),
    shouldRedirect: !authLoading && !isAuthenticated,
    shouldDenyAccess: !authLoading && isAuthenticated && !hasRole('Admin')
  }), [isAuthenticated, authLoading, hasRole]);

  // Check authentication and admin role
  useEffect(() => {
    if (authCheck.shouldRedirect) {
      localStorage.setItem('redirectAfterLogin', '/admin/analytics');
      router.push('/login');
      return;
    }
    
    if (authCheck.shouldDenyAccess) {
      toast.error('Access denied. Admin privileges required.');
      router.push('/');
    }
  }, [authCheck, router]);

  // Fetch analytics data only once when authenticated and authorized
  useEffect(() => {
    if (authCheck.isAuthenticated && authCheck.hasRole && !isInitialized) {
      fetchAnalyticsData();
    }
  }, [authCheck.isAuthenticated, authCheck.hasRole, isInitialized, fetchAnalyticsData]);

  const handleDownloadAnalytics = async () => {
    try {
      toast.loading('Generating analytics report...');
      
      // Create comprehensive analytics report
      const reportData = [
        ['IntelliBiz Analytics Report', '', ''],
        ['Generated on', new Date().toLocaleDateString(), ''],
        ['', '', ''],
        ['Overview Metrics', '', ''],
        ['Total Businesses', analyticsData?.overview.totalBusinesses || 0, ''],
        ['Total Users', analyticsData?.overview.totalUsers || 0, ''],
        ['Total Reviews', analyticsData?.overview.totalReviews || 0, ''],
        ['Total Messages', analyticsData?.overview.totalMessages || 0, ''],
        ['', '', ''],
        ['Growth Metrics', '', ''],
        ['Business Growth', `${analyticsData?.overview.businessGrowth || 0}%`, ''],
        ['User Growth', `${analyticsData?.overview.userGrowth || 0}%`, ''],
        ['Review Growth', `${analyticsData?.overview.reviewGrowth || 0}%`, ''],
        ['Message Growth', `${analyticsData?.overview.messageGrowth || 0}%`, ''],
        ['', '', ''],
        ['Top Businesses by Reviews', '', ''],
        ...(analyticsData?.businessMetrics.topBusinesses.map(b => [b.name, b.reviews.toString(), b.rating.toFixed(1)]) || [])
      ];
      
      const csvContent = reportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `intellibiz-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Analytics report downloaded!');
    } catch (error) {
      console.error('Error downloading analytics:', error);
      toast.error('Failed to download report');
    }
  };

  const handleRefresh = () => {
    refreshData();
    toast.success('Analytics data refreshed!');
  };

  // Show loading state while checking authentication
  if (authLoading || (loading && !isInitialized)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated or not an admin
  if (!authCheck.isAuthenticated || !authCheck.hasRole) {
    return null;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={handleRefresh}>Retry</Button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No analytics data available</p>
          <Button onClick={handleRefresh} className="mt-4">Refresh</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your platform performance.</p>
        </div>
      </div>

      {/* Time Range Selector and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Time Range:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleDownloadAnalytics} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalBusinesses}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {analyticsData.overview.businessGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analyticsData.overview.businessGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analyticsData.overview.businessGrowth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

      <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalUsers}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {analyticsData.overview.userGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analyticsData.overview.userGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analyticsData.overview.userGrowth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalReviews}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {analyticsData.overview.reviewGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analyticsData.overview.reviewGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analyticsData.overview.reviewGrowth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalMessages}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <MessageSquare className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {analyticsData.overview.messageGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={analyticsData.overview.messageGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analyticsData.overview.messageGrowth)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="businesses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="businesses" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Businesses
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Businesses by Category</CardTitle>
                <CardDescription>Distribution of businesses across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.businessMetrics.byCategory.length > 0 ? (
                    analyticsData.businessMetrics.byCategory.map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No category data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Businesses</CardTitle>
                <CardDescription>Most reviewed businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.businessMetrics.topBusinesses.length > 0 ? (
                    analyticsData.businessMetrics.topBusinesses.map((business, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{business.name}</p>
                          <p className="text-xs text-muted-foreground">{business.reviews} reviews</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm">{business.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No business data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Users by Role</CardTitle>
                <CardDescription>Distribution of users across roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData.userMetrics.byRole.length > 0 ? (
                    analyticsData.userMetrics.byRole.map((item) => (
                      <div key={item.role} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{item.role}</span>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No user data available</p>
                  )}
                </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Current active user count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{analyticsData.userMetrics.activeUsers}</p>
                  <p className="text-sm text-muted-foreground">out of {analyticsData.overview.totalUsers} total users</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Reviews by Rating</CardTitle>
                <CardDescription>Distribution of review ratings</CardDescription>
        </CardHeader>
        <CardContent>
                <div className="space-y-2">
                  {analyticsData.reviewMetrics.byRating.length > 0 ? (
                    analyticsData.reviewMetrics.byRating.map((item) => (
                      <div key={item.rating} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.rating} stars</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < item.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No review data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Rating</CardTitle>
                <CardDescription>Overall platform rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${
                          i < Math.floor(analyticsData.reviewMetrics.averageRating)
                            ? "text-yellow-400 fill-current"
                            : i < analyticsData.reviewMetrics.averageRating
                            ? "text-yellow-400 fill-current opacity-50"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-2xl font-bold">{analyticsData.reviewMetrics.averageRating.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">out of 5 stars</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>Important metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-green-800">Platform Growth</p>
                      <p className="text-xs text-green-600">Strong business and user growth</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Engagement</p>
                      <p className="text-xs text-blue-600">High review activity</p>
                    </div>
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Quality</p>
                      <p className="text-xs text-yellow-600">Good average rating</p>
                    </div>
                    <BarChart3 className="h-5 w-5 text-yellow-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
                      <p className="text-sm font-medium text-purple-800">Activity</p>
                      <p className="text-xs text-purple-600">Active user base</p>
                    </div>
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 