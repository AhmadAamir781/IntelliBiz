"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BusinessCard } from "@/components/business-card"
import { BusinessFilters } from "@/components/business-filters"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { businessService, Business } from "@/services/businessService"
import { toast } from "sonner"

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [sortBy, setSortBy] = useState("Relevance")

  useEffect(() => {
    loadBusinesses()
  }, [])

  const loadBusinesses = async () => {
    try {
      setLoading(true)
      const data = await businessService.getAllBusinesses()
      setBusinesses(data)
      setError(null)
    } catch (err) {
      setError("Failed to load businesses")
      toast.error("Failed to load businesses")
    } finally {
      setLoading(false)
    }
  }

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = business.address.toLowerCase().includes(locationQuery.toLowerCase())
    return matchesSearch && matchesLocation
  })

  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case "Rating: High to Low":
        return b.rating - a.rating
      case "Rating: Low to High":
        return a.rating - b.rating
      case "Name: A to Z":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Find Local Businesses</h1>
          <p className="text-muted-foreground">Browse and connect with trusted local service providers in your area</p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search businesses, services..." 
                className="pl-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full md:max-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Location" 
                className="pl-9" 
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <select 
              className="text-sm border rounded-md px-3 py-2 bg-background h-10"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Relevance</option>
              <option>Rating: High to Low</option>
              <option>Rating: Low to High</option>
              <option>Name: A to Z</option>
            </select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <BusinessFilters />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{sortedBusinesses.length}</span> businesses
          </p>
        </div>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-1">
            <Button variant="outline" size="icon" disabled>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              4
            </Button>
            <Button variant="outline" size="sm">
              5
            </Button>
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

