"use client"

import { useState } from "react"
import Link from "next/link"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, MoreHorizontal, Edit, Trash2, Eye, UserPlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [userType, setUserType] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Mock user data
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      type: "customer",
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      type: "business",
      status: "active",
      joinDate: "2023-02-20",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      type: "customer",
      status: "active",
      joinDate: "2023-03-10",
    },
    {
      id: "4",
      name: "Emily Wilson",
      email: "emily.wilson@example.com",
      type: "customer",
      status: "inactive",
      joinDate: "2023-03-15",
    },
    {
      id: "5",
      name: "David Martinez",
      email: "david.martinez@example.com",
      type: "business",
      status: "active",
      joinDate: "2023-03-20",
    },
    {
      id: "6",
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      type: "customer",
      status: "active",
      joinDate: "2023-04-05",
    },
    {
      id: "7",
      name: "Robert Taylor",
      email: "robert.taylor@example.com",
      type: "business",
      status: "inactive",
      joinDate: "2023-04-10",
    },
    {
      id: "8",
      name: "Lisa Anderson",
      email: "lisa.anderson@example.com",
      type: "customer",
      status: "active",
      joinDate: "2023-04-15",
    },
  ]

  // Filter users based on type and search query
  const filteredUsers = users.filter((user) => {
    if (userType !== "all" && user.type !== userType) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    }

    return true
  })

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the user
    console.log(`Deleting user with ID: ${userToDelete}`)
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  const toggleUserSelection = (id: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((userId) => userId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage all users on the platform.</p>
        </div>
        <div className="flex justify-between items-center">
          <Button asChild>
            <Link href="/admin/users/add">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage all users registered on IntelliBiz.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={userType} onValueChange={setUserType} className="w-full">
            <div className="flex flex-col gap-4 mb-6">
              <div className="overflow-x-auto">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="customer">Customers</TabsTrigger>
                  <TabsTrigger value="business">Business Owners</TabsTrigger>
                </TabsList>
              </div>
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
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
                      <TableHead className="w-[40px]">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={toggleAllUsers}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Join Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No users found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.type === "business" ? "outline" : "secondary"}>
                              {user.type === "business" ? "Business Owner" : "Customer"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                user.status === "active"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {user.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(user.joinDate).toLocaleDateString()}
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
                                  <Link href={`/admin/users/${user.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/users/${user.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
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

            <TabsContent value="customer" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="business" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>
          </Tabs>

          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
              </span>
              <Button variant="outline" size="sm">
                Export Selected
              </Button>
              <Button variant="destructive" size="sm">
                Delete Selected
              </Button>
            </div>
          )}

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
              Are you sure you want to delete this user? This action cannot be undone.
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

