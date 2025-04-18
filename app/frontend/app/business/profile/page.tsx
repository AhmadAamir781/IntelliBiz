"use client"

import React from "react"
import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { CardFooter } from "@/components/ui/card"
import { useBusinessProfile } from "@/hooks/useBusinessProfile"
import { Loader2 } from "lucide-react"

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

export default function BusinessProfilePage() {
  const router = useRouter()
  const params = useParams()
  const businessId = Number(params.id)
  const [isEditing, setIsEditing] = useState(false)
  const { business, loading, error, isSubmitting, updateBusiness } = useBusinessProfile(businessId)
  const { showSuccessToast, showErrorToast } = useToast()

  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  // Update form data when business data is loaded
  React.useEffect(() => {
    if (business) {
      setFormData({
        businessName: business.name,
        category: business.category,
        description: business.description,
        phone: business.phoneNumber,
        email: business.email,
        website: business.website || "",
        address: business.address,
        city: business.city,
        state: business.state,
        zipCode: business.zipCode,
      })
    }
  }, [business])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateBusiness({
        name: formData.businessName,
        category: formData.category,
        description: formData.description,
        phoneNumber: formData.phone,
        email: formData.email,
        website: formData.website,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      })
      setIsEditing(false)
    } catch (error: any) {
      console.error("Profile update failed:", error)
      showErrorToast("Profile update failed", error.message || "An error occurred")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading business profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.refresh()} className="mt-4">Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/business">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Business Profile</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Manage your business profile and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="e.g., Smith Plumbing Services"
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="category">
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
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your business, services, and what makes you unique..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="e.g., (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g., contact@yourbusiness.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  name="website"
                  placeholder="e.g., https://yourbusiness.com"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="e.g., 123 Main Street"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g., New York"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="e.g., NY"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="e.g., 10001"
                    value={formData.zipCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Business Logo (Optional)
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 2MB)</p>
                  </div>
                  <input id="logo-upload" type="file" className="hidden" disabled={!isEditing} />
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    // Reset form data to original business data
                    if (business) {
                      setFormData({
                        businessName: business.name,
                        category: business.category,
                        description: business.description,
                        phone: business.phoneNumber,
                        email: business.email,
                        website: business.website || "",
                        address: business.address,
                        city: business.city,
                        state: business.state,
                        zipCode: business.zipCode,
                      })
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
