"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { appointmentApi } from "@/lib/api"

interface BookingDialogProps {
  businessName: string
  businessId: number
  trigger: React.ReactNode
}

export function BookingDialog({ businessName, businessId, trigger }: BookingDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"date" | "details">("date")

  // Available time slots
  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ]

  // Get services based on business category
  const getServicesForBusiness = (id: string) => {
    // This would normally fetch from an API based on the business ID
    // For now, we'll return different services based on the ID
    switch (id) {
      case "1": // Smith Plumbing
        return [
          "Plumbing Repair",
          "Pipe Installation",
          "Drain Cleaning",
          "Water Heater Service",
          "Fixture Installation",
          "Emergency Service",
        ]
      case "2": // Elite Electrical
        return [
          "Electrical Repair",
          "Wiring Installation",
          "Lighting Installation",
          "Electrical Inspection",
          "Panel Upgrade",
          "Emergency Service",
        ]
      default:
        return [
          "General Consultation",
          "Maintenance Service",
          "Repair Service",
          "Installation Service",
          "Emergency Service",
        ]
    }
  }

  const services = getServicesForBusiness(businessId.toString())

  // Convert time from AM/PM format to TimeSpan format with 7 decimal places for milliseconds
  const convertToTimeSpanFormat = (timeStr: string): string => {
    const [time, period] = timeStr.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert to 24-hour format
    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Return in TimeSpan format with 7 decimal places for milliseconds (HH:mm:ss.0000000)
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.0000000`;
  }

  // Calculate endTime (30 minutes after start time)
  const calculateEndTime = (startTime: string): string => {
    // Convert from AM/PM format to 24-hour format for TimeSpan
    const [timeStr, period] = startTime.split(' ');
    const [hourStr, minuteStr] = timeStr.split(':');
    
    let hour = parseInt(hourStr);
    let minute = parseInt(minuteStr);
    
    // Convert to 24-hour format
    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Add 30 minutes
    minute += 30;
    
    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }
    
    if (hour >= 24) {
      hour -= 24;
    }
    
    // Return in TimeSpan format with 7 decimal places for milliseconds (HH:mm:ss.0000000)
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00.0000000`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!date) {
        throw new Error("Date is required");
      }

      // Format the date as a string in YYYY-MM-DD format
      const dateString = format(date, 'yyyy-MM-dd');
      
      // Convert times to TimeSpan format
      const startTimeFormatted = convertToTimeSpanFormat(time);
      const endTimeFormatted = calculateEndTime(time);

      console.log("Date being sent:", dateString);
      console.log("Start time being sent:", startTimeFormatted);
      console.log("End time being sent:", endTimeFormatted);

      // Prepare the payload according to the API requirements and type definition
      const appointmentData = {
        userId: 0, // This would normally come from the authenticated user
        businessId: businessId,
        serviceId: 0, // This would normally be the actual service ID
        date: dateString,
        time: startTimeFormatted, // Use TimeSpan format for the time field too
        startTime: startTimeFormatted,
        endTime: endTimeFormatted,
        status: 'pending' as const,
        notes: notes,
        customer: {
          id: 0,
          name: name,
          email: email,
          phone: phone
        },
        service: {
          id: 0,
          name: service,
          duration: 30 // Default duration in minutes
        }
      };

      console.log("Appointment data:", appointmentData);

      // Send the request to the API
      const response = await appointmentApi.createAppointment(appointmentData);

      if (!response.success) {
        throw new Error(response.message || "Failed to book appointment");
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form after 3 seconds and close dialog
      setTimeout(() => {
        setIsSuccess(false);
        setDate(undefined);
        setTime("");
        setName("");
        setEmail("");
        setPhone("");
        setService("");
        setNotes("");
        setStep("date");
        setOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      setIsSubmitting(false);
      setError(error instanceof Error ? error.message : "Failed to book appointment");
    }
  }

  const handleNextStep = () => {
    if (date && time && service) {
      setStep("details")
    }
  }

  const handleBackStep = () => {
    setStep("date")
  }

  const resetDialog = () => {
    setDate(undefined)
    setTime("")
    setName("")
    setEmail("")
    setPhone("")
    setService("")
    setNotes("")
    setStep("date")
    setIsSuccess(false)
    setError(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          resetDialog()
        }
      }}
    >
      <DialogTrigger asChild>{trigger || <Button>Book Appointment</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-center mb-2">Appointment Booked!</DialogTitle>
            <DialogDescription className="text-center">
              Your appointment with {businessName} has been scheduled for{" "}
              {date && time ? `${format(date, "MMMM d, yyyy")} at ${time}` : "the selected date and time"}.
              <br />
              You will receive a confirmation email shortly.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book an Appointment</DialogTitle>
              <DialogDescription>
                Schedule an appointment with {businessName}.{" "}
                {step === "date"
                  ? "Select your preferred date, time, and service."
                  : "Please provide your contact information."}
              </DialogDescription>
            </DialogHeader>

            {step === "date" ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <div className="border rounded-md p-2 mx-auto max-w-[350px]">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))
                      }
                      initialFocus
                      className="mx-auto"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Select Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Select Service</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((svc) => (
                        <SelectItem key={svc} value={svc}>
                          {svc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!date || !time || !service}
                    className="w-full sm:w-auto"
                  >
                    Continue
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Please provide any additional details about your service needs..."
                    rows={3}
                  />
                </div>

                <div className="bg-muted/50 p-3 rounded-md mt-4">
                  <h4 className="text-sm font-medium mb-2">Appointment Summary</h4>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Date:</span> {date ? format(date, "MMMM d, yyyy") : ""}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span> {time}
                    </p>
                    <p>
                      <span className="font-medium">Service:</span> {service}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 mt-6">
                  <Button type="button" variant="outline" onClick={handleBackStep} className="w-full sm:w-auto">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !name || !email || !phone}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Booking...
                      </div>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
