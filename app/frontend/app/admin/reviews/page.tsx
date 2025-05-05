"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, MoreHorizontal, Eye, Flag, CheckCircle, AlertTriangle, Star, Trash2, XCircle, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAdminReviews } from "@/hooks/useAdminReviews"
import { Skeleton } from "@/components/ui/skeleton"
import { Review } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { toast } from 'sonner'

export default function ReviewManagement() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout, hasRole } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewStatus, setReviewStatus] = useState<"all" | "published" | "pending" | "flagged">("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null)
  const [reviewDetailsOpen, setReviewDetailsOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  // Check authentication and admin role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', '/admin/reviews')
        router.push('/login')
        return
      }
      
      // Check if user has admin role
      if (isAuthenticated && !hasRole('admin')) {
        toast.error('Access denied. Admin privileges required.')
        router.push('/')
      }
    }
  }, [isAuthenticated, authLoading, router, hasRole])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const { reviews, stats, loading, error, totalPages, approveReview, rejectReview, deleteReview, unflagReview } = useAdminReviews({
    status: reviewStatus,
    page: currentPage,
    pageSize: 10,
  })

  // Filter reviews based on search query
  const filteredReviews = reviews?.filter((review) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        review.userName?.toLowerCase().includes(query) ||
        review.businessName?.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query)
      )
    }
    return true
  }) || [];

  const handleDeleteReview = (id: number) => {
    setReviewToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (reviewToDelete) {
      await deleteReview(reviewToDelete)
      setDeleteDialogOpen(false)
      setReviewToDelete(null)
    }
  }

  const handleViewReview = (review: Review) => {
    setSelectedReview(review)
    setReviewDetailsOpen(true)
  }

  const getStatusBadge = (status: string, isFlagged: boolean) => {
    if (isFlagged) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <Flag className="mr-1 h-3 w-3" />
          Flagged
        </Badge>
      )
    }

    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Published
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Unknown
          </Badge>
        )
    }
  }

  // Show loading state while checking authentication
  if (authLoading || (loading && !error)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render content if not authenticated or not an admin
  if (!isAuthenticated || (isAuthenticated && !hasRole('admin'))) {
    return null
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Review Management</h1>
            <p className="text-muted-foreground">Monitor and moderate customer reviews.</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Reviews</CardTitle>
          <CardDescription>View and manage all reviews on IntelliBiz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={reviewStatus} onValueChange={(value) => setReviewStatus(value as typeof reviewStatus)} className="w-full">
            <div className="flex flex-col gap-4 mb-6">
              <div className="overflow-x-auto">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="flagged">Flagged</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search reviews..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={5}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName || "User"} />
                              <AvatarFallback>{review.userName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.userName || "Unknown User"}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{review.businessName || "Unknown Business"}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(review.status, review.isFlagged)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewReview(review)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              {review.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => approveReview(review.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => rejectReview(review.id)}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {review.isFlagged && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => unflagReview(review.id)}>
                                    <Flag className="mr-2 h-4 w-4" />
                                    Unflag
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No reviews found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reviewDetailsOpen} onOpenChange={setReviewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedReview.userAvatar || "/placeholder.svg"} alt={selectedReview.userName || "User"} />
                  <AvatarFallback>{selectedReview.userName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedReview.userName || "Unknown User"}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Business</p>
                <p>{selectedReview.businessName || "Unknown Business"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < selectedReview.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Review</p>
                <p className="mt-1">{selectedReview.comment}</p>
              </div>

              {selectedReview.isFlagged && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Flag Reason</p>
                  <p className="mt-1 text-red-600">{selectedReview.flagReason || "No reason provided"}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
