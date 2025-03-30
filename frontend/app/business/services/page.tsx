"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Search, MoreHorizontal, Edit, Trash2, Eye, Plus, CheckCircle, XCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  // Mock services data
  const services = [
    {
      id: "1",
      name: "Pipe Repair",
      description: "Repair of damaged or leaking pipes",
      price: "$75 - $150",
      duration: "1-2 hours",
      active: true,
    },
    {
      id: "2",
      name: "Drain Cleaning",
      description: "Professional cleaning of clogged drains",
      price: "$100 - $200",
      duration: "1-3 hours",
      active: true,
    },
    {
      id: "3",
      name: "Water Heater Installation",
      description: "Installation of new water heaters",
      price: "$300 - $600",
      duration: "3-5 hours",
      active: true,
    },
    {
      id: "4",
      name: "Leak Detection",
      description: "Professional detection of hidden leaks",
      price: "$150 - $250",
      duration: "1-2 hours",
      active: true,
    },
    {
      id: "5",
      name: "Toilet Installation",
      description: "Installation of new toilets",
      price: "$200 - $350",
      duration: "2-3 hours",
      active: false,
    },
    {
      id: "6",
      name: "Faucet Replacement",
      description: "Replacement of kitchen and bathroom faucets",
      price: "$100 - $200",
      duration: "1-2 hours",
      active: true,
    },
    {
      id: "7",
      name: "Sewer Line Repair",
      description: "Repair of damaged sewer lines",
      price: "$500 - $1,500",
      duration: "4-8 hours",
      active: false,
    },
  ]

  // Filter services based on search query
  const filteredServices = services.filter((service) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return service.name.toLowerCase().includes(query) || service.description.toLowerCase().includes(query)
    }
    return true
  })

  const handleDeleteService = (id: string) => {
    setServiceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // In a real app, you would call an API to delete the service
    console.log(`Deleting service with ID: ${serviceToDelete}`)
    setDeleteDialogOpen(false)
    setServiceToDelete(null)
  }

  const toggleServiceStatus = (id: string) => {
    // In a real app, you would call an API to update the service status
    console.log(`Toggling status for service with ID: ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage the services you offer to customers.</p>
        </div>
        <Button className="w-full sm:w-auto" asChild>
          <Link href="/business/services/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Your Services</CardTitle>
          <CardDescription>View and manage all services offered by your business.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No services found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {service.description}
                      </TableCell>
                      <TableCell>{service.price}</TableCell>
                      <TableCell className="hidden md:table-cell">{service.duration}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.active}
                            onCheckedChange={() => toggleServiceStatus(service.id)}
                            id={`status-${service.id}`}
                          />
                          <Label htmlFor={`status-${service.id}`} className="text-sm hidden sm:inline-flex">
                            {service.active ? (
                              <span className="text-green-600 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </span>
                            )}
                          </Label>
                        </div>
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
                              <Link href={`/business/services/${service.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/business/services/${service.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteService(service.id)} className="text-red-600">
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
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

