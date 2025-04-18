"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BusinessReviews } from "@/components/business-reviews"
import { BusinessGallery } from "@/components/business-gallery"
import { BusinessHours } from "@/components/business-hours"
import { BookingDialog } from "@/components/booking-dialog"
import { MessageDialog } from "@/components/message-dialog"
import { MapPin, Phone, Mail, Globe, Calendar, MessageSquare, Star, Clock, CheckCircle2, Share2 } from "lucide-react"
import { useBusinessDetail } from "@/hooks/useBusinessDetail"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function BusinessDetailPage() {
  const { id } = useParams()
  const { business, loading, error } = useBusinessDetail(Number(id))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-muted-foreground">{error || "Business not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/businesses">Back to businesses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6">
          <Link href="/businesses" className="text-primary hover:underline flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to businesses
          </Link>
        </div>

        {/* Business Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/3 lg:w-1/4">
            <div className="aspect-square relative rounded-lg overflow-hidden border bg-muted">
              <img
                // src={business.images[0] || "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop"}
                src={ "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop"}
                alt={business.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {business.category}
                  </Badge>
                  {business.verified && (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{business.name}</h1>
                <div className="flex items-center gap-1 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(business.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : i < business.rating
                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                              : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{business.rating}</span>
                  <span className="text-muted-foreground">({business.reviewCount} reviews)</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{business.description}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button className="gap-2">
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
              <MessageDialog
                businessName={business.name}
                businessId={business.id}
                businessAvatar={"https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop"}
                trigger={
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                }
              />
              <BookingDialog
                businessName={business.name}
                businessId={business.id}
                trigger={
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Book Appointment
                  </Button>
                }
              />
              <Button variant="outline" size="icon" title="Share on Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-blue-600"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Button>
              <Button variant="outline" size="icon" title="Share on WhatsApp">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-green-500"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </Button>
              <Button variant="outline" size="icon" title="Share on Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-pink-600"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Button>
              <Button variant="ghost" size="icon" title="Copy Link">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Business Details Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 mb-6 overflow-x-auto">
            <TabsTrigger
              value="about"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-muted-foreground">{business.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">{business.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-muted-foreground">{business.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Website</p>
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {business.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Business Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Founded</p>
                        <p>{business.founded}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Owner</p>
                        <p>{business.owner}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Employees</p>
                        <p>{business.employees}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Licenses</p>
                        <p>{business.licenses}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Payment Methods</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {business.paymentMethods.map((method) => (
                          <Badge key={method} variant="secondary">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Service Areas</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {business.serviceAreas.map((area) => (
                          <Badge key={area} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Business Hours</h3>
                    </div>
                    <BusinessHours hours={business.hours} />
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Location</h3>
                      <div className="aspect-video bg-muted rounded-md overflow-hidden">
                        <img
                          src="/placeholder.svg?height=300&width=500&text=Map"
                          alt="Business location map"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{business.address}</p>
                      <Button variant="outline" className="w-full mt-4 gap-2">
                        <MapPin className="h-4 w-4" />
                        Get Directions
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-6">Services Offered</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {business.services.map((service) => (
                    <div key={service} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <BusinessReviews businessId={business.id} />
          </TabsContent>

          <TabsContent value="gallery" className="mt-0">
            <BusinessGallery images={business.images} businessName={business.name} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
