"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin, Phone, Mail, Clock, Info, Building, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { businessApi } from "@/lib/api"

// Business categories
const businessCategories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Landscaping",
  "Automotive",
  "Beauty & Wellness",
  "Food & Catering",
  "Education & Tutoring",
  "IT & Technology",
  "Healthcare",
  "Legal Services",
  "Financial Services",
  "Other",
]

export default function RegisterBusinessPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Info
    businessName: "",
    category: "",
    description: "",

    // Contact Info
    phone: "",
    email: "",
    website: "",

    // Location
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Hours
    mondayOpen: "09:00",
    mondayClose: "17:00",
    tuesdayOpen: "09:00",
    tuesdayClose: "17:00",
    wednesdayOpen: "09:00",
    wednesdayClose: "17:00",
    thursdayOpen: "09:00",
    thursdayClose: "17:00",
    fridayOpen: "09:00",
    fridayClose: "17:00",
    saturdayOpen: "",
    saturdayClose: "",
    sundayOpen: "",
    sundayClose: "",

    // Additional Info
    services: "",
    yearsInBusiness: "",
    licenses: "",

    // Owner Info
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",

    // Terms
    agreeTerms: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { showSuccessToast, showErrorToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeTerms: checked,
    }))

    if (errors.agreeTerms) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.agreeTerms
        return newErrors
      })
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {

      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required"
      }

      if (!formData.category) {
        newErrors.category = "Category is required"
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      } else if (formData.description.length < 50) {
        newErrors.description = "Description should be at least 50 characters"
      }
    } else if (step === 2) {
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }

      if (!formData.address.trim()) {
        newErrors.address = "Address is required"
      }

      if (!formData.city.trim()) {
        newErrors.city = "City is required"
      }

      if (!formData.state.trim()) {
        newErrors.state = "State is required"
      }

      if (!formData.zipCode.trim()) {
        newErrors.zipCode = "ZIP code is required"
      }
    } else if (step === 4) {
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "You must agree to the terms and conditions"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setIsLoading(true)

    try {
      const response = await businessApi.createBusiness(formData)
      if (response.data.success) {
        showSuccessToast("Business registered successfully!")
        router.push("/businesses")
      } else {
        showErrorToast("Business registration failed", response.data.message || "An error occurred")
      }
    } catch (error: any) {
      console.error("Business registration failed:", error)
      showErrorToast("Business registration failed", error.response?.data?.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Register Your Business</CardTitle>
          <CardDescription>Complete the form below to list your business on IntelliBiz</CardDescription>

          <div className="mt-4">
            <div className="mt-4 overflow-x-auto pb-2">
              <Tabs value={`step-${currentStep}`} className="w-full">
                <TabsList className="grid w-full grid-cols-4 min-w-[500px]">
                  <TabsTrigger value="step-1" disabled className="text-xs sm:text-sm whitespace-nowrap">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="step-2" disabled className="text-xs sm:text-sm whitespace-nowrap">
                    Contact & Location
                  </TabsTrigger>
                  <TabsTrigger value="step-3" disabled className="text-xs sm:text-sm whitespace-nowrap">
                    Hours & Services
                  </TabsTrigger>
                  <TabsTrigger value="step-4" disabled className="text-xs sm:text-sm whitespace-nowrap">
                    Review & Submit
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    Business Name
                  </Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="e.g., Smith Plumbing Services"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className={errors.businessName ? "border-destructive" : ""}
                  />
                  {errors.businessName && <p className="text-xs text-destructive">{errors.businessName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Business Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    Business Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your business, services, and what makes you unique..."
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                  <p className="text-xs text-muted-foreground">
                    Min. 50 characters. Include your specialties, experience, and what sets you apart.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    Business Logo (Optional)
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (Max. 2MB)</p>
                      </div>
                      <input id="logo-upload" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="e.g., (555) 123-4567"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g., contact@yourbusiness.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="e.g., https://yourbusiness.com"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Business Location</h3>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="e.g., 123 Main Street"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="e.g., New York"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        placeholder="e.g., NY"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="e.g., 10001"
                        required
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={errors.zipCode ? "border-destructive" : ""}
                      />
                      {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Business Hours
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Set your regular business hours. Leave blank if closed on a particular day.
                  </p>

                  <div className="space-y-3 mt-4">
                    {[
                      { day: "Monday", open: "mondayOpen", close: "mondayClose" },
                      { day: "Tuesday", open: "tuesdayOpen", close: "tuesdayClose" },
                      { day: "Wednesday", open: "wednesdayOpen", close: "wednesdayClose" },
                      { day: "Thursday", open: "thursdayOpen", close: "thursdayClose" },
                      { day: "Friday", open: "fridayOpen", close: "fridayClose" },
                      { day: "Saturday", open: "saturdayOpen", close: "saturdayClose" },
                      { day: "Sunday", open: "sundayOpen", close: "sundayClose" },
                    ].map((item) => (
                      <div key={item.day} className="grid grid-cols-3 gap-4 items-center">
                        <Label className="text-sm">{item.day}</Label>
                        <div>
                          <Input
                            type="time"
                            name={item.open}
                            value={formData[item.open as keyof typeof formData] as string}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <Input
                            type="time"
                            name={item.close}
                            value={formData[item.close as keyof typeof formData] as string}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-lg font-medium">Services & Additional Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="services">Services Offered</Label>
                    <Textarea
                      id="services"
                      name="services"
                      placeholder="List your main services, separated by commas..."
                      rows={3}
                      value={formData.services}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      E.g., Plumbing repairs, Pipe installation, Drain cleaning
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business</Label>
                      <Input
                        id="yearsInBusiness"
                        name="yearsInBusiness"
                        placeholder="e.g., 5"
                        value={formData.yearsInBusiness}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="licenses">Licenses/Certifications (Optional)</Label>
                      <Input
                        id="licenses"
                        name="licenses"
                        placeholder="e.g., Licensed Master Plumber #12345"
                        value={formData.licenses}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Business Owner Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">Owner Name</Label>
                      <Input
                        id="ownerName"
                        name="ownerName"
                        placeholder="e.g., John Smith"
                        value={formData.ownerName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone">Owner Phone (Optional)</Label>
                      <Input
                        id="ownerPhone"
                        name="ownerPhone"
                        placeholder="e.g., (555) 123-4567"
                        value={formData.ownerPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerEmail">Owner Email (Optional)</Label>
                    <Input
                      id="ownerEmail"
                      name="ownerEmail"
                      type="email"
                      placeholder="e.g., owner@yourbusiness.com"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      This email will not be displayed publicly. It will only be used for account management.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Review Your Information</h3>
                  <p className="text-sm text-muted-foreground">
                    Please review your business information before submitting.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium">Business Information</h4>
                          <ul className="mt-2 space-y-1">
                            <li>
                              <span className="text-muted-foreground">Name:</span> {formData.businessName}
                            </li>
                            <li>
                              <span className="text-muted-foreground">Category:</span> {formData.category}
                            </li>
                            <li>
                              <span className="text-muted-foreground">Years in Business:</span>{" "}
                              {formData.yearsInBusiness || "Not specified"}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium">Contact Information</h4>
                          <ul className="mt-2 space-y-1">
                            <li>
                              <span className="text-muted-foreground">Phone:</span> {formData.phone}
                            </li>
                            <li>
                              <span className="text-muted-foreground">Email:</span> {formData.email}
                            </li>
                            <li>
                              <span className="text-muted-foreground">Website:</span>{" "}
                              {formData.website || "Not specified"}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">Location</h4>
                        <p className="mt-1">
                          {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">Description</h4>
                        <p className="mt-1 text-sm">{formData.description}</p>
                      </div>

                      <div className="mt-4">
                        <h4 className="font-medium">Services</h4>
                        <p className="mt-1">{formData.services || "Not specified"}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={handleCheckboxChange}
                    className={errors.agreeTerms ? "border-destructive" : ""}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that all information provided is accurate and I agree to the{" "}
                    <a href="/terms" className="text-primary underline-offset-4 hover:underline">
                      terms of service
                    </a>
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious} className="w-full sm:w-auto">
                Previous
              </Button>
            )}

            <div className="flex w-full sm:w-auto">
              {currentStep < 4 ? (
                <Button type="button" onClick={handleNext} className="w-full">
                  Next
                </Button>
              ) : (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Register Business"}
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
