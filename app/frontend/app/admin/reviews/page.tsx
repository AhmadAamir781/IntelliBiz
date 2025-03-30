"use client"

import { useState } from "react"
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
import { Search, MoreHorizontal, Eye, Flag, CheckCircle, AlertTriangle, Star, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ReviewManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewStatus, setReviewStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)
  const [reviewDetailsOpen, setReviewDetailsOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)

  // Mock review data
  const reviews = [
    {
      id: "1",
      user: {
        id: "u1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      business: {
        id: "b1",
        name: "Smith Plumbing Services",
      },
      rating: 5,
      content:
        "Excellent service! They arrived on time and fixed our plumbing issue quickly. Very professional and knowledgeable. I would definitely use their services again and recommend them to others.",
      date: "2023-03-15",
      status: "published",
      flagged: false,
    },
    {
      id: "2",
      user: {
        id: "u2",
        name: "Sarah Miller",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      business: {
        id: "b1",
        name: "Smith Plumbing Services",
      },
      rating: 4,
      content:
        "Good service overall. They fixed our leaky faucet and were very thorough. The only reason I'm not giving 5 stars is because they were about 30 minutes late for the appointment. Otherwise, the work quality was excellent.",
      date: "2023-03-14",
      status: "published",
      flagged: false,
    },
    {
      id: "3",
      user: {
        id: "u3",
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      business: {
        id: "b2",
        name: "Elite Electrical Solutions",
      },
      rating: 5,
      content:
        "I had a major electrical issue in my basement and called Elite Electrical for emergency service. They arrived within an hour and worked efficiently to fix the issue. They even helped clean up afterward. Highly recommend!",
      date: "2023-03-13",
      status: "published",
      flagged: false,
    },
    {
      id: "4",
      user: {
        id: "u4",
        name: "Emily Wilson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      business: {
        id: "b3",
        name: "Green Thumb Landscaping",
      },
      rating: 2,
      content:
        "Very disappointed with the service. They were supposed to trim our hedges and clean up the yard, but they left a mess and the hedges look uneven. Would not recommend.",
      date: "2023-03-12",
      status: "flagged",
      flagged: true,
      flagReason: "Disputed by business owner",
    },
    {
      id: "5",
      user: {
        id: "u5",
        name: "David Martinez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      business: {
        id: "b4",
        name: "Sparkle Cleaning Services",
      },
      rating: 1,
      content:
        "This is the worst cleaning service I've ever used! They broke my vase and didn't even apologize. Stay away from this company!",
      date: "2023-03-11",
      status: "flagged",
      flagged: true,
      flagReason: "Potentially abusive content",
    },
    {
      id: "6",
      user: {
        id: "u6",
        name: "Jennifer Lee",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      business: {
        id: "b5",
        name: "Master Carpentry",
      },
      rating: 5,
      content:
        "Amazing craftsmanship! They built a custom bookshelf for my home office and it's absolutely beautiful. The attention to detail is impressive. Highly recommend!",
      date: "2023-03-10",
      status: "published",
      flagged: false,
    },
    {
      id: "7",
      user: {
        id: "u7",
        name: "Robert Taylor",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      business: {
        id: "b1",
        name: "Smith Plumbing Services",
      },
      rating: 3,
      content:
        "Average service. Fixed the issue but charged more than the initial quote. Not sure if I would use them again.",
      date: "2023-03-09",
      status: "pending",
      flagged: false,
    },
  ]

  // Filter reviews based on status and search query
  const filteredReviews = reviews.filter((review) => {
    if (reviewStatus === "flagged" && !review.flagged) {
      return false
    } else if (reviewStatus === "pending" && review.status !== "pending") {
      return false
    } else if (reviewStatus === "published" && review.status !== "published") {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        review.user.name.toLowerCase().includes(query) ||
        review.business.name.toLowerCase().includes(query) ||
        review.content.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleDeleteReview = (id: string) => {
    setReviewToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the review
    console.log(`Deleting review with ID: ${reviewToDelete}`)
    setDeleteDialogOpen(false)
    setReviewToDelete(null)
  }

  const handleViewReview = (review: any) => {
    setSelectedReview(review)
    setReviewDetailsOpen(true)
  }

  const approveReview = (id: string) => {
    // In a real app, you would call an API to approve the review
    console.log(`Approving review with ID: ${id}`)
  }

  const rejectReview = (id: string) => {
    // In a real app, you would call an API to reject the review
    console.log(`Rejecting review with ID: ${id}`)
  }

  const unflagReview = (id: string) => {
    // In a real app, you would call an API to unflag the review
    console.log(`Unflagging review with ID: ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Review Management</h1>
          <p className="text-muted-foreground">Monitor and moderate customer reviews.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Reviews</CardTitle>
          <CardDescription>View and manage all reviews on IntelliBiz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={reviewStatus} onValueChange={setReviewStatus} className="w-full">
            <div className="flex flex-col gap-4 mb-6">
              <div className="overflow-x-auto">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All Reviews</TabsTrigger>
                  <TabsTrigger value="flagged">Flagged</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                </TabsList>
              </div>
              <div className="relative w-full">
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

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden md:table-cell">Review</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No reviews found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                                <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium truncate max-w-[100px] md:max-w-none">
                                {review.user.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="truncate max-w-[100px] md:max-w-none">{review.business.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
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
                          </TableCell>
                          <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                            {review.content}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(review.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {review.flagged ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <Flag className="mr-1 h-3 w-3" />
                                Flagged
                              </Badge>
                            ) : review.status === "pending" ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Pending
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Published
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewReview(review)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {review.status === "pending" && (
                                  <>
                                    <DropdownMenuItem onClick={() => approveReview(review.id)}>
                                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => rejectReview(review.id)}>
                                      <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {review.flagged && (
                                  <DropdownMenuItem onClick={() => unflagReview(review.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Unflag
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="flagged" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="pending" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="published" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
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

      {/* Review Details Dialog */}
      <Dialog open={reviewDetailsOpen} onOpenChange={setReviewDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedReview.user.avatar} alt={selectedReview.user.name} />
                  <AvatarFallback>{selectedReview.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedReview.user.name}</p>
                  <p className="text-sm text-muted-foreground">{new Date(selectedReview.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Business</p>
                <p>{selectedReview.business.name}</p>
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
                <p className="mt-1">{selectedReview.content}</p>
              </div>

              {selectedReview.flagged && (
                <div>
                  <p className="text-sm font-medium text-red-600">Flag Reason</p>
                  <p className="mt-1 text-sm">{selectedReview.flagReason}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                {selectedReview.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        rejectReview(selectedReview.id)
                        setReviewDetailsOpen(false)
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        approveReview(selectedReview.id)
                        setReviewDetailsOpen(false)
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
                {selectedReview.flagged && (
                  <Button
                    onClick={() => {
                      unflagReview(selectedReview.id)
                      setReviewDetailsOpen(false)
                    }}
                  >
                    Unflag
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

