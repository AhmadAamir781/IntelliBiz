"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Search, Save } from "lucide-react"

export default function LocationPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    serviceArea: "Manhattan, Brooklyn, Queens, Bronx, Staten Island",
    serviceRadius: "25",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, you would call an API to save the location
      console.log("Location data:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsEditing(false)
    } catch (error) {
      console.error("Error saving location:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Location Management</h1>
          <p className="text-muted-foreground">Manage your business location and service area.</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit Location"}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Business Location</CardTitle>
            <CardDescription>Your physical business address and service area</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Areas</Label>
                  <Textarea
                    id="serviceArea"
                    name="serviceArea"
                    value={formData.serviceArea}
                    onChange={handleChange}
                    placeholder="List the areas you serve, separated by commas"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the neighborhoods, cities, or regions you serve, separated by commas.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
                  <Input
                    id="serviceRadius"
                    name="serviceRadius"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.serviceRadius}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    The maximum distance you're willing to travel to provide services.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <>
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Business Address</p>
                    <p className="text-muted-foreground">{formData.address}</p>
                    <p className="text-muted-foreground">
                      {formData.city}, {formData.state} {formData.zipCode}
                    </p>
                    <p className="text-muted-foreground">{formData.country}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium">Service Areas</p>
                  <p className="text-muted-foreground">{formData.serviceArea}</p>
                </div>

                <div>
                  <p className="font-medium">Service Radius</p>
                  <p className="text-muted-foreground">{formData.serviceRadius} miles</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Map View</CardTitle>
            <CardDescription>Visual representation of your business location and service area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute top-2 left-2 right-2 z-10">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for a location..."
                    className="pl-8 pr-10 bg-white/90 backdrop-blur-sm"
                  />
                  <Button size="sm" className="absolute right-1 top-1">
                    Search
                  </Button>
                </div>
              </div>
              <div className="h-[400px] bg-muted rounded-md overflow-hidden">
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <MapPin className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Map will be displayed here</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">Drag the pin to adjust your exact location</p>
            <Button variant="outline" size="sm">
              Reset Map
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Service Area Visibility</CardTitle>
          <CardDescription>Control how your service area is displayed to customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="exact-address"
                name="visibility"
                className="h-4 w-4 rounded-full border-gray-300"
                defaultChecked
              />
              <div>
                <Label htmlFor="exact-address">Show Exact Address</Label>
                <p className="text-sm text-muted-foreground">
                  Display your complete address to customers. Best for businesses with a physical location that
                  customers visit.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="radio" id="approximate" name="visibility" className="h-4 w-4 rounded-full border-gray-300" />
              <div>
                <Label htmlFor="approximate">Show Approximate Location</Label>
                <p className="text-sm text-muted-foreground">
                  Display only your city and ZIP code. Good for service-based businesses that travel to customers.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="service-area-only"
                name="visibility"
                className="h-4 w-4 rounded-full border-gray-300"
              />
              <div>
                <Label htmlFor="service-area-only">Show Service Area Only</Label>
                <p className="text-sm text-muted-foreground">
                  Hide your address completely and only show your service area. Best for home-based businesses.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

