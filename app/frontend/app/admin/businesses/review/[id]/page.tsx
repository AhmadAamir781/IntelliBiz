"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  AlertTriangle,
  Building2,
  User
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useBusinessReview } from "@/hooks/useBusinessReview"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function BusinessReviewPage() {
  const router = useRouter()
  const params = useParams()
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth()
  const [reviewLoading, setReviewLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const businessId = params.id as string
  const { business, services, reviews, owner, loading, error, updateBusinessStatus } = useBusinessReview(businessId)
// Calculate average rating from reviews
const averageRating = reviews.length > 0 
? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
: business?.rating || 0
  // Check authentication and admin role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', `/admin/businesses/review/${businessId}`)
        router.push('/login')
        return
      }
      
      if (isAuthenticated && !hasRole('Admin')) {
        toast.error('Access denied. Admin privileges required.')
        router.push('/')
      }
    }
  }, [isAuthenticated, authLoading, router, hasRole, businessId])

  const handleApprove = async () => {
    setReviewLoading(true)
    try {
      const result = await updateBusinessStatus('approved')
      if (result?.success) {
        toast.success('Business approved successfully')
        router.push('/admin/businesses')
      } else {
        toast.error(result?.error || 'Failed to approve business')
      }
    } catch (error) {
      console.error('Error approving business:', error)
      toast.error('Failed to approve business')
    } finally {
      setReviewLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setReviewLoading(true)
    try {
      const result = await updateBusinessStatus('rejected')
      if (result?.success) {
        toast.success('Business rejected successfully')
        router.push('/admin/businesses')
      } else {
        toast.error(result?.error || 'Failed to reject business')
      }
    } catch (error) {
      console.error('Error rejecting business:', error)
      toast.error('Failed to reject business')
    } finally {
      setReviewLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Don't render content if not authenticated or not an admin
  if (!isAuthenticated || (isAuthenticated && !hasRole('Admin'))) {
    return null
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="space-y-6">
        <div className="text-red-500">Business not found</div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending Review
          </Badge>
        )
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Review</h1>
          <p className="text-muted-foreground">Review and approve business registration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{business.businessName}</CardTitle>
                  <CardDescription>{business.category}</CardDescription>
                </div>
                {getStatusBadge(business.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{business.description}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      {business.address}, {business.city}, {business.state} {business.zipCode}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{business.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{business.email}</p>
                  </div>
                </div>
                
                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-sm text-muted-foreground">{business.website}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Services and Reviews Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="services" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                
                <TabsContent value="services" className="space-y-4">
                  {services.length > 0 ? (
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">${service.price}</Badge>
                            <Badge variant="outline">{service.duration}min</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No services listed yet</p>
                  )}
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4">
                  {reviews.length > 0 ? (
                    <div className="space-y-3">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              by {review.userName || 'Anonymous'}
                            </span>
                            {review.isFlagged && (
                              <Badge variant="destructive" className="text-xs">
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{review.comment}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No reviews yet</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Business Owner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {owner ? (
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={owner.profilePicture || ""} />
                    <AvatarFallback>
                      {owner.firstName[0]}{owner.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {owner.firstName} {owner.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{owner.email}</p>
                    {owner.phoneNumber && (
                      <p className="text-sm text-muted-foreground">{owner.phoneNumber}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Owner information not available</p>
              )}
            </CardContent>
          </Card>

          {/* Registration Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Registration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Registered On</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(business.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(business.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Rating</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-current"
                          : i < averageRating
                            ? "text-yellow-400 fill-current opacity-50"
                            : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Verified</p>
                <Badge variant={business.isVerified ? "default" : "secondary"}>
                  {business.isVerified ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Review Actions */}
          {business.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Review Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button 
                    onClick={handleApprove}
                    disabled={reviewLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Business
                  </Button>
                  
                  <Button 
                    variant="destructive"
                    onClick={handleReject}
                    disabled={reviewLoading}
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Business
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rejection Reason (if rejecting)</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection..."
                    className="w-full p-2 border rounded-md text-sm resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 