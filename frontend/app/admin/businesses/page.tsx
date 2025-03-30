"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"

export default function BusinessManagement() {
  const searchParams = useSearchParams()
  const filterParam = searchParams.get("filter") || "all"

  const [filter, setFilter] = useState(filterParam)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [businessToDelete, setBusinessToDelete] = useState<string | null>(null)

  // Mock business data
  const businesses = [
    {
      id: "1",
      name: "Smith Plumbing Services",
      category: "Plumbing",
      owner: "John Smith",
      location: "New York, NY",
      status: "approved",
      registrationDate: "2023-01-15",
      verified: true,
    },
    {
      id: "2",
      name: "Elite Electrical Solutions",
      category: "Electrical",
      owner: "Sarah Johnson",
      location: "Brooklyn, NY",
      status: "approved",
      registrationDate: "2023-02-20",
      verified: true,
    },
    {
      id: "3",
      name: "Green Thumb Landscaping",
      category: "Landscaping",
      owner: "Michael Brown",
      location: "Queens, NY",
      status: "approved",
      registrationDate: "2023-03-10",
      verified: false,
    },
    {
      id: "4",
      name: "Quick Plumbing Solutions",
      category: "Plumbing",
      owner: "Robert Davis",
      location: "Manhattan, NY",
      status: "pending",
      registrationDate: "2023-03-15",
      verified: false,
    },
    {
      id: "5",
      name: "Modern Electrical Services",
      category: "Electrical",
      owner: "Jennifer Wilson",
      location: "Bronx, NY",
      status: "pending",
      registrationDate: "2023-03-14",
      verified: false,
    },
    {
      id: "6",
      name: "Green Gardens Landscaping",
      category: "Landscaping",
      owner: "David Martinez",
      location: "Staten Island, NY",
      status: "pending",
      registrationDate: "2023-03-13",
      verified: false,
    },
    {
      id: "7",
      name: "Sparkle Home Cleaning",
      category: "Cleaning",
      owner: "Lisa Anderson",
      location: "Brooklyn, NY",
      status: "pending",
      registrationDate: "2023-03-12",
      verified: false,
    },
    {
      id: "8",
      name: "Fake Business LLC",
      category: "Other",
      owner: "Unknown User",
      location: "Unknown",
      status: "rejected",
      registrationDate: "2023-03-11",
      verified: false,
    },
  ]

  // Filter businesses based on status
  const filteredBusinesses = businesses.filter((business) => {
    if (filter !== "all" && business.status !== filter) {
      return false
    }

    if (selectedCategory !== "all" && business.category !== selectedCategory) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        business.name.toLowerCase().includes(query) ||
        business.owner.toLowerCase().includes(query) ||
        business.location.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleDeleteBusiness = (id: string) => {
    setBusinessToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the business
    console.log(`Deleting business with ID: ${businessToDelete}`)
    setDeleteDialogOpen(false)
    setBusinessToDelete(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Business Management</h1>
          <p className="text-muted-foreground">Manage all registered businesses on the platform.</p>
        </div>
        <div className="flex justify-between items-center">
          <Button asChild>
            <Link href="/admin/businesses/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Business
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Businesses</CardTitle>
          <CardDescription>View and manage all businesses registered on IntelliBiz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={filter} onValueChange={setFilter} className="w-full">
            <div className="flex flex-col gap-4 mb-6">
              <div className="overflow-x-auto">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search businesses..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Landscaping">Landscaping</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Registration Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBusinesses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No businesses found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBusinesses.map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="font-medium">
                            {business.name}
                            {business.verified && (
                              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                Verified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{business.category}</TableCell>
                          <TableCell>{business.owner}</TableCell>
                          <TableCell className="hidden md:table-cell">{business.location}</TableCell>
                          <TableCell>{getStatusBadge(business.status)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(business.registrationDate).toLocaleDateString()}
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/businesses/${business.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/businesses/${business.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteBusiness(business.id)}
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

            <TabsContent value="approved" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="pending" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="rejected" className="m-0">
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
              Are you sure you want to delete this business? This action cannot be undone.
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
    </div>
  )
}

