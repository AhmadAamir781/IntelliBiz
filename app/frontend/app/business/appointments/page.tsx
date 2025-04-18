"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
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
import { useAppointments } from "@/hooks/useAppointments"
import { format } from "date-fns"
import { Appointment } from "@/lib/types"

export default function AppointmentsPage() {
  const params = useParams()
  const businessId = Number(params.id)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [appointmentStatus, setAppointmentStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [appointmentDetailsOpen, setAppointmentDetailsOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(null)

  const {
    appointments,
    loading,
    error,
    refresh,
    updateStatus,
    deleteAppointment
  } = useAppointments(businessId)

  // Filter appointments based on status, date, and search query
  const filteredAppointments = appointments.filter((appointment) => {
    if (appointmentStatus !== "all" && appointment.status !== appointmentStatus) {
      return false
    }

    if (selectedDate) {
      const appointmentDate = format(new Date(appointment.date), "yyyy-MM-dd")
      if (appointmentDate !== selectedDate) {
        return false
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        appointment.customer.name.toLowerCase().includes(query) ||
        appointment.service.name.toLowerCase().includes(query) ||
        appointment.notes?.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setAppointmentDetailsOpen(true)
  }

  const handleCancelAppointment = (id: number) => {
    setAppointmentToCancel(id)
    setCancelDialogOpen(true)
  }

  const confirmCancel = async () => {
    if (appointmentToCancel) {
      try {
        await updateStatus(appointmentToCancel, "cancelled")
        setCancelDialogOpen(false)
        setAppointmentToCancel(null)
      } catch (err) {
        console.error("Failed to cancel appointment:", err)
      }
    }
  }

  const confirmAppointment = async (id: number) => {
    try {
      await updateStatus(id, "confirmed")
    } catch (err) {
      console.error("Failed to confirm appointment:", err)
    }
  }

  const completeAppointment = async (id: number) => {
    try {
      await updateStatus(id, "completed")
    } catch (err) {
      console.error("Failed to complete appointment:", err)
    }
  }

  const getStatusBadge = (status: Appointment['status']) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={refresh} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground">Manage your business appointments and schedules.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/business/${businessId}/appointments/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex gap-2">
              <Tabs value={appointmentStatus} onValueChange={setAppointmentStatus}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
              </Tabs>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[180px]"
              />
            </div>
          </div>

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
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={appointment.customer.avatar} />
                        <AvatarFallback>
                          {appointment.customer.name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{appointment.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.service.name}</TableCell>
                  <TableCell>
                    <div>
                      <p>{format(new Date(appointment.date), "MMM dd, yyyy")}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.time), "hh:mm a")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.service.duration} minutes</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewAppointment(appointment)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {appointment.status === "pending" && (
                          <DropdownMenuItem onClick={() => confirmAppointment(appointment.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm
                          </DropdownMenuItem>
                        )}
                        {appointment.status === "confirmed" && (
                          <DropdownMenuItem onClick={() => completeAppointment(appointment.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                        {appointment.status !== "cancelled" && appointment.status !== "completed" && (
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
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
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

      <Dialog open={appointmentDetailsOpen} onOpenChange={setAppointmentDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment details
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Customer Information</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {selectedAppointment.customer.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    {selectedAppointment.customer.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    {selectedAppointment.customer.phone}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Appointment Details</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="text-muted-foreground">Service:</span>{" "}
                    {selectedAppointment.service.name}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Date:</span>{" "}
                    {format(new Date(selectedAppointment.date), "MMM dd, yyyy")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time:</span>{" "}
                    {format(new Date(selectedAppointment.time), "hh:mm a")}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    {selectedAppointment.service.duration} minutes
                  </p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    {getStatusBadge(selectedAppointment.status)}
                  </p>
                </div>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-medium">Notes</h3>
                  <p className="mt-2 text-muted-foreground">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
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
