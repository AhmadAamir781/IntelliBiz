"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Users, Star, Calendar, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BusinessAnalytics() {
  const [timeRange, setTimeRange] = useState("30days")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock analytics data
  const overviewData = {
    profileViews: {
      total: 1248,
      change: 12,
      positive: true,
    },
    appointments: {
      total: 156,
      change: 8,
      positive: true,
    },
    reviews: {
      total: 124,
      change: 15,
      positive: true,
    },
    messages: {
      total: 38,
      change: -5,
      positive: false,
    },
  }

  const topServices = [
    {
      name: "Pipe Repair",
      views: 450,
      bookings: 32,
      revenue: "$4,800",
      growth: 15,
      positive: true,
    },
    {
      name: "Drain Cleaning",
      views: 380,
      bookings: 28,
      revenue: "$4,200",
      growth: 10,
      positive: true,
    },
    {
      name: "Water Heater Installation",
      views: 320,
      bookings: 18,
      revenue: "$9,000",
      growth: 25,
      positive: true,
    },
    {
      name: "Leak Detection",
      views: 280,
      bookings: 15,
      revenue: "$3,000",
      growth: -5,
      positive: false,
    },
    {
      name: "Faucet Replacement",
      views: 250,
      bookings: 12,
      revenue: "$1,800",
      growth: 8,
      positive: true,
    },
  ]

  const customerDemographics = {
    age: [
      { group: "18-24", percentage: 10 },
      { group: "25-34", percentage: 35 },
      { group: "35-44", percentage: 25 },
      { group: "45-54", percentage: 15 },
      { group: "55-64", percentage: 10 },
      { group: "65+", percentage: 5 },
    ],
    gender: [
      { group: "Male", percentage: 55 },
      { group: "Female", percentage: 45 },
    ],
    location: [
      { area: "Manhattan", percentage: 40 },
      { area: "Brooklyn", percentage: 25 },
      { area: "Queens", percentage: 20 },
      { area: "Bronx", percentage: 10 },
      { area: "Staten Island", percentage: 5 },
    ],
  }

  const customerSources = [
    { source: "Search", percentage: 45 },
    { source: "Direct", percentage: 20 },
    { source: "Referral", percentage: 15 },
    { source: "Social Media", percentage: 12 },
    { source: "Email", percentage: 8 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track your business performance and customer engagement.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{overviewData.profileViews.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Eye className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {overviewData.profileViews.positive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={
                  overviewData.profileViews.positive ? "text-green-500 font-medium" : "text-red-500 font-medium"
                }
              >
                {overviewData.profileViews.positive ? "+" : ""}
                {overviewData.profileViews.change}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                <p className="text-2xl font-bold">{overviewData.appointments.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {overviewData.appointments.positive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={
                  overviewData.appointments.positive ? "text-green-500 font-medium" : "text-red-500 font-medium"
                }
              >
                {overviewData.appointments.positive ? "+" : ""}
                {overviewData.appointments.change}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviews</p>
                <p className="text-2xl font-bold">{overviewData.reviews.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Star className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {overviewData.reviews.positive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={overviewData.reviews.positive ? "text-green-500 font-medium" : "text-red-500 font-medium"}
              >
                {overviewData.reviews.positive ? "+" : ""}
                {overviewData.reviews.change}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">{overviewData.messages.total}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              {overviewData.messages.positive ? (
                <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span
                className={overviewData.messages.positive ? "text-green-500 font-medium" : "text-red-500 font-medium"}
              >
                {overviewData.messages.positive ? "+" : ""}
                {overviewData.messages.change}%
              </span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Your business performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Performance chart will be displayed here</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Customer Sources</CardTitle>
                <CardDescription>How customers find your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSources.map((source) => (
                    <div key={source.source}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{source.source}</span>
                        <span className="text-sm text-muted-foreground">{source.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Customer Locations</CardTitle>
                <CardDescription>Where your customers are located</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerDemographics.location.map((location) => (
                    <div key={location.area}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{location.area}</span>
                        <span className="text-sm text-muted-foreground">{location.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Top Performing Services</CardTitle>
              <CardDescription>Your most popular services by views, bookings, and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topServices.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.views}</TableCell>
                      <TableCell>{service.bookings}</TableCell>
                      <TableCell>{service.revenue}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {service.positive ? (
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                          )}
                          <span
                            className={service.positive ? "text-green-500 font-medium" : "text-red-500 font-medium"}
                          >
                            {service.positive ? "+" : ""}
                            {service.growth}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Service Performance</CardTitle>
              <CardDescription>Detailed performance metrics for each service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Service performance chart will be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Age groups of your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerDemographics.age.map((age) => (
                    <div key={age.group}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{age.group}</span>
                        <span className="text-sm text-muted-foreground">{age.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${age.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Gender breakdown of your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerDemographics.gender.map((gender) => (
                    <div key={gender.group}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{gender.group}</span>
                        <span className="text-sm text-muted-foreground">{gender.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${gender.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Engagement</CardTitle>
              <CardDescription>How customers interact with your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
                <TrendingUp className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Customer engagement chart will be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

