"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  LogOut,
} from "lucide-react"
import { useAdminBusinesses } from "@/hooks/useAdminBusinesses"
import { Skeleton } from "@/components/ui/skeleton"
import { useBusinesses } from '@/hooks/useBusinesses'
import { useAuth } from "@/hooks/use-auth"
import { toast } from 'sonner'
import { businessApi } from '@/lib/api'

export default function BusinessManagement() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout, hasRole } = useAuth()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get("filter") || "all"

  const [filter, setFilter] = useState(filterParam)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [businessToDelete, setBusinessToDelete] = useState<number | null>(null)

  // Check authentication and admin role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', '/admin/businesses')
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

  const { businesses, stats, loading, error, totalPages, updateBusinessStatus, deleteBusiness } = useAdminBusinesses({
    status: filter as 'all' | 'approved' | 'pending' | 'rejected',
    category: selectedCategory,
    searchQuery,
    page: currentPage,
    pageSize: 10,
  })

  const { businesses: businessesApi, loading: businessesApiLoading, error: businessesApiError, refetch } = useBusinesses()
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null)

  const handleDeleteBusiness = (id: number) => {
    setBusinessToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (businessToDelete) {
      await deleteBusiness(Number(businessToDelete))
      setDeleteDialogOpen(false)
      setBusinessToDelete(null)
    }
  }

  const getStatusBadge = (isVerified: boolean) => {
    if (isVerified) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>;
    }
    return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleApprove = async (id: number) => {
    try {
      const response = await businessApi.verifyBusiness(id)
      if (response.data) {
        toast.success('Business verified successfully')
        refetch()
      } else {
        toast.error(response.message || 'Failed to verify business')
      }
    } catch (err) {
      toast.error('An error occurred while verifying the business')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await businessApi.deleteBusiness(id)
      if (response) {
        toast.success('Business deleted successfully')
        refetch()
      } else {
        toast.error(response || 'Failed to delete business')
      }
    } catch (err) {
      toast.error('An error occurred while deleting the business')
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Business Management</h1>
            <p className="text-muted-foreground">Manage all registered businesses on the platform.</p>
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
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {stats?.categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Owner</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : businesses.length > 0 ? (
                    businesses.map((business) => (
                      <TableRow key={business.id}>
                        <TableCell className="font-medium">{business.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{business.category}</TableCell>
                        <TableCell className="hidden md:table-cell">{business.ownerId}</TableCell>
                        <TableCell className="hidden md:table-cell">{business.address}</TableCell>
                        <TableCell>{getStatusBadge(business.isVerified)}</TableCell>
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
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/businesses/${business.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/businesses/edit/${business.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              {!business.isVerified && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(business.id)}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteBusiness(business.id)}
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
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No businesses found
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
            <DialogTitle>Delete Business</DialogTitle>
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
