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
import { Search, MoreHorizontal, Eye, CheckCircle, XCircle, Clock, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [appointmentStatus, setAppointmentStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null)

  // Mock appointments data
  const appointments = [
    {
      id: "1",
      customer: {
        id: "c1",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      service: "Pipe Repair",
      date: "2023-03-20",
      time: "10:00 AM",
      duration: "2 hours",
      status: "confirmed",
      notes: "Issue with kitchen sink pipes",
    },
    {
      id: "2",
      customer: {
        id: "c2",
        name: "Sarah Miller",
        email: "sarah.miller@example.com",
        phone: "(555) 234-5678",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      service: "Drain Cleaning",
      date: "2023-03-21",
      time: "2:30 PM",
      duration: "1 hour",
      status: "confirmed",
      notes: "Bathroom sink draining slowly",
    },
    {
      id: "3",
      customer: {
        id: "c3",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "(555) 345-6789",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      service: "Water Heater Installation",
      date: "2023-03-22",
      time: "9:00 AM",
      duration: "3 hours",
      status: "pending",
      notes: "New water heater installation, old one needs to be removed",
    },
    {
      id: "4",
      customer: {
        id: "c4",
        name: "Emily Wilson",
        email: "emily.wilson@example.com",
        phone: "(555) 456-7890",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      service: "Leak Detection",
      date: "2023-03-23",
      time: "11:30 AM",
      duration: "1 hour",
      status: "pending",
      notes: "Possible leak under the kitchen sink",
    },
    {
      id: "5",
      customer: {
        id: "c5",
        name: "David Martinez",
        email: "david.martinez@example.com",
        phone: "(555) 567-8901",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      service: "Faucet Replacement",
      date: "2023-03-24",
      time: "3:00 PM",
      duration: "1 hour",
      status: "confirmed",
      notes: "Replace bathroom faucet, customer has new fixture",
    },
    {
      id: "6",
      customer: {
        id: "c6",
        name: "Jennifer Lee",
        email: "jennifer.lee@example.com",
        phone: "(555) 678-9012",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      service: "Toilet Installation",
      date: "2023-03-25",
      time: "10:00 AM",
      duration: "2 hours",
      status: "cancelled",
      notes: "Customer cancelled due to scheduling conflict",
    },
    {
      id: "7",
      customer: {
        id: "c7",
        name: "Robert Taylor",
        email: "robert.taylor@example.com",
        phone: "(555) 789-0123",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      service: "Pipe Repair",
      date: "2023-03-26",
      time: "1:00 PM",
      duration: "2 hours",
      status: "completed",
      notes: "Fixed leaking pipe under sink",
    },
  ]

  // Filter appointments based on status, date, and search query
  const filteredAppointments = appointments.filter((appointment) => {
    if (appointmentStatus !== "all" && appointment.status !== appointmentStatus) {
      return false
    }

    if (selectedDate && appointment.date !== selectedDate) {
      return false
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        appointment.customer.name.toLowerCase().includes(query) ||
        appointment.service.toLowerCase().includes(query) ||
        appointment.notes.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment)
    setAppointmentDetailsOpen(true)
  }

  const handleCancelAppointment = (id: string) => {
    setAppointmentToCancel(id)
    setCancelDialogOpen(true)
  }

  const confirmCancel = () => {
    // In a real app, you would call an API to cancel the appointment
    console.log(`Cancelling appointment with ID: ${appointmentToCancel}`)
    setCancelDialogOpen(false)
    setAppointmentToCancel(null)
  }

  const confirmAppointment = (id: string) => {
    // In a real app, you would call an API to confirm the appointment
    console.log(`Confirming appointment with ID: ${id}`)
  }

  const completeAppointment = (id: string) => {
    // In a real app, you would call an API to mark the appointment as completed
    console.log(`Marking appointment with ID: ${id} as completed`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage your customer appointments.</p>
        </div>
        <Button asChild>
          <Link href="/business/appointments/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Appointment
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Appointments</CardTitle>
          <CardDescription>View and manage all customer appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={appointmentStatus} onValueChange={setAppointmentStatus} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search appointments..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-[180px]"
                />
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No appointments found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={appointment.customer.avatar} alt={appointment.customer.name} />
                                <AvatarFallback>{appointment.customer.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{appointment.customer.name}</p>
                                <p className="text-xs text-muted-foreground">{appointment.customer.phone}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </TableCell>
                          <TableCell>{appointment.duration}</TableCell>
                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleViewAppointment(appointment)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {appointment.status === "pending" && (
                                  <DropdownMenuItem onClick={() => confirmAppointment(appointment.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                    Confirm
                                  </DropdownMenuItem>
                                )}
                                {appointment.status === "confirmed" && (
                                  <DropdownMenuItem onClick={() => completeAppointment(appointment.id)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                                    Mark as Completed
                                  </DropdownMenuItem>
                                )}
                                {(appointment.status === "pending" || appointment.status === "confirmed") && (
                                  <DropdownMenuItem
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    className="text-red-600"
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                  </DropdownMenuItem>
                                )}
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

            <TabsContent value="pending" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="confirmed" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="completed" className="m-0">
              {/* Same table structure as "all" tab but with filtered data */}
            </TabsContent>

            <TabsContent value="cancelled" className="m-0">
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

      {/* Appointment Details Dialog */}
      <Dialog open={appointmentDetailsOpen} onOpenChange={setAppointmentDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedAppointment.customer.avatar} alt={selectedAppointment.customer.name} />
                  <AvatarFallback>{selectedAppointment.customer.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedAppointment.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.customer.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service</p>
                  <p>{selectedAppointment.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p>{selectedAppointment.duration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p>{selectedAppointment.time}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div className="mt-1">{getStatusBadge(selectedAppointment.status)}</div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="mt-1">{selectedAppointment.notes}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                <p className="mt-1">Email: {selectedAppointment.customer.email}</p>
                <p>Phone: {selectedAppointment.customer.phone}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {selectedAppointment.status === "pending" && (
                  <Button
                    onClick={() => {
                      confirmAppointment(selectedAppointment.id)
                      setAppointmentDetailsOpen(false)
                    }}
                  >
                    Confirm
                  </Button>
                )}
                {selectedAppointment.status === "confirmed" && (
                  <Button
                    onClick={() => {
                      completeAppointment(selectedAppointment.id)
                      setAppointmentDetailsOpen(false)
                    }}
                  >
                    Mark as Completed
                  </Button>
                )}
                {(selectedAppointment.status === "pending" || selectedAppointment.status === "confirmed") && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleCancelAppointment(selectedAppointment.id)
                      setAppointmentDetailsOpen(false)
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Cancellation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Yes, Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

