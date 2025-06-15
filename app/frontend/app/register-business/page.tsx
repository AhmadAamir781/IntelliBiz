"use client"

import type React from "react"
import Link from 'next/link';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, MapPin, Phone, Mail, Clock, Link as LucideLink, Info, Building, User, ArrowLeft, LogOut } from "lucide-react"
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

// Replace with a theme-based accent class
const themeAccentClass = "focus:border-primary/30 focus:ring-primary/20";

export default function RegisterBusinessPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { showSuccessToast, showErrorToast } = useToast()
  
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

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/register-business');
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
      } else if (formData.description.length < 10) {
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

      if (response.data) {
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

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-accent to-background px-4 py-12">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-primary hover:text-primary/80 flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center flex-1 mx-auto w-full max-w-6xl">
        <Card className="w-full max-w-3xl border-primary/20 shadow-md">
          <CardHeader className="space-y-1 border-b border-primary/10 bg-gradient-to-r from-background to-accent/50">
            <CardTitle className="text-2xl font-bold text-primary">Register Your Business</CardTitle>
            <CardDescription>Complete the form below to list your business on IntelliBiz</CardDescription>

            <div className="mt-4">
              <div className="mt-4 overflow-x-auto pb-2">
                <Tabs value={`step-${currentStep}`} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 min-w-[500px] bg-muted">
                    <TabsTrigger 
                      value="step-1" 
                      disabled={Number(currentStep) !== 1} 
                      className={`text-xs sm:text-sm whitespace-nowrap ${Number(currentStep) === 1 ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger 
                      value="step-2" 
                      disabled={Number(currentStep) !== 2} 
                      className={`text-xs sm:text-sm whitespace-nowrap ${Number(currentStep) === 2 ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      Contact & Location
                    </TabsTrigger>
                    <TabsTrigger 
                      value="step-3" 
                      disabled={Number(currentStep) !== 3} 
                      className={`text-xs sm:text-sm whitespace-nowrap ${Number(currentStep) === 3 ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      Hours & Services
                    </TabsTrigger>
                    <TabsTrigger 
                      value="step-4" 
                      disabled={Number(currentStep) !== 4} 
                      className={`text-xs sm:text-sm whitespace-nowrap ${Number(currentStep) === 4 ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      Review & Submit
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {Number(currentStep) === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-primary" />
                      Business Name
                    </Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      placeholder="e.g., Smith Plumbing Services"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      className={`${errors.businessName ? "border-destructive" : "border-input"} ${themeAccentClass}`}
                    />
                    {errors.businessName && <p className="text-xs text-destructive">{errors.businessName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Business Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger className={`${errors.category ? "border-destructive" : ""} ${themeAccentClass}`}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="border-primary/20">
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
                      <Info className="mr-2 h-4 w-4 text-primary" />
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
                      className={`${errors.description ? "border-destructive" : ""} ${themeAccentClass}`}
                    />
                    {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                    <p className="text-xs text-muted-foreground">
                      Min. 10 characters. Include your specialties, experience, and what sets you apart.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Upload className="mr-2 h-4 w-4 text-primary" />
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

              {Number(currentStep) === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-primary">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-primary" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="e.g., (555) 123-4567"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className={`${errors.phone ? "border-destructive" : ""} ${themeAccentClass}`}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-primary" />
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
                          className={`${errors.email ? "border-destructive" : ""} ${themeAccentClass}`}
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className={`${themeAccentClass}`}>Website (Optional)</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="e.g., https://yourbusiness.com"
                        value={formData.website}
                        onChange={handleChange}
                        className={themeAccentClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-primary">Business Location</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-primary" />
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="e.g., 123 Main Street"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className={`${errors.address ? "border-destructive" : ""} ${themeAccentClass}`}
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
                          className={`${errors.city ? "border-destructive" : ""} ${themeAccentClass}`}
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
                          className={`${errors.state ? "border-destructive" : ""} ${themeAccentClass}`}
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
                          className={`${errors.zipCode ? "border-destructive" : ""} ${themeAccentClass}`}
                        />
                        {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {Number(currentStep) === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center text-primary">
                      <Clock className="mr-2 h-5 w-5 text-primary" />
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
                              className={themeAccentClass}
                            />
                          </div>
                          <div>
                            <Input
                              type="time"
                              name={item.close}
                              value={formData[item.close as keyof typeof formData] as string}
                              onChange={handleChange}
                              className={themeAccentClass}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-medium text-primary">Services & Additional Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="services">Services Offered</Label>
                      <Textarea
                        id="services"
                        name="services"
                        placeholder="List your main services, separated by commas..."
                        rows={3}
                        value={formData.services}
                        onChange={handleChange}
                        className={themeAccentClass}
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
                          className={themeAccentClass}
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
                          className={themeAccentClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <h3 className="text-lg font-medium flex items-center text-primary">
                      <User className="mr-2 h-5 w-5 text-primary" />
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
                          className={themeAccentClass}
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
                          className={themeAccentClass}
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
                        className={themeAccentClass}
                      />
                      <p className="text-xs text-muted-foreground">
                        This email will not be displayed publicly. It will only be used for account management.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {Number(currentStep) === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-primary">Review Your Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Please review your business information before submitting.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card className="border-primary/20 shadow-sm">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-primary">Business Information</h4>
                            <ul className="mt-2 space-y-1">
                              <li>
                                <span className="text-primary/80">Name:</span> {formData.businessName}
                              </li>
                              <li>
                                <span className="text-primary/80">Category:</span> {formData.category}
                              </li>
                              <li>
                                <span className="text-primary/80">Years in Business:</span>{" "}
                                {formData.yearsInBusiness || "Not specified"}
                              </li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-primary">Contact Information</h4>
                            <ul className="mt-2 space-y-1">
                              <li>
                                <span className="text-primary/80">Phone:</span> {formData.phone}
                              </li>
                              <li>
                                <span className="text-primary/80">Email:</span> {formData.email}
                              </li>
                              <li>
                                <span className="text-primary/80">Website:</span>{" "}
                                {formData.website || "Not specified"}
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium text-primary">Location</h4>
                          <p className="mt-1">
                            {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                          </p>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium text-primary">Description</h4>
                          <p className="mt-1 text-sm">{formData.description}</p>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium text-primary">Services</h4>
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
                      className={`${errors.agreeTerms ? "border-destructive" : "border-primary/30"} data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground`}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm that all information provided is accurate and I agree to the{" "}
                      <a href="/terms" className="text-orange-500 underline-offset-4 hover:underline">
                        terms of service
                      </a>
                    </label>
                  </div>
                  {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4 border-t border-primary/10">
              {Number(currentStep) > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious} className="w-full sm:w-auto hover:bg-accent hover:text-accent-foreground">
                  Previous
                </Button>
              )}

              <div className="flex w-full sm:w-auto">
                {Number(currentStep) < 4 ? (
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
    </div>
  )
}
