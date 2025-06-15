"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { businessApi } from "@/lib/api"
import { Business } from "@/lib/types"
import { toast } from "sonner"

// Business categories
const categories = [
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

interface BusinessFiltersProps {
  onFiltersApplied?: (businesses: Business[]) => void
  onClose?: () => void
}

export function BusinessFilters({ onFiltersApplied, onClose }: BusinessFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [rating, setRating] = useState([4])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [distance, setDistance] = useState([10])
  const [loading, setLoading] = useState(false)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleReset = () => {
    setSelectedCategories([])
    setRating([4])
    setVerifiedOnly(false)
    setDistance([10])
  }

  const handleApply = async () => {
    try {
      setLoading(true)
      
      if (selectedCategories.length === 0) {
        // If no categories selected, get all businesses
        const response = await businessApi.getAllBusinesses()
        
        // Apply additional filters
        let filteredBusinesses = response.data.filter((business: Business) => {
          // Filter by rating
          if (business.rating && business.rating < rating[0]) return false
          // Filter by verified status
          if (verifiedOnly && !business.isVerified) return false
          // Distance filtering would be handled here if we had location data
          return true
        })
        
        if (onFiltersApplied) {
          onFiltersApplied(filteredBusinesses)
        }
      } else {
        // Get businesses for each selected category and combine results
        let allBusinesses: Business[] = []
         
        for (const category of selectedCategories) {
          const response = await businessApi.getBusinessesByCategory(category)
          if (response.data) {
            allBusinesses = [...allBusinesses, ...response.data]
          }
        }
        
        // Remove duplicates (if a business belongs to multiple categories)
        const uniqueBusinesses = Array.from(
          new Map(allBusinesses.map(business => [business.id, business])).values()
        )
        
        // Apply additional filters
        let filteredBusinesses = uniqueBusinesses.filter((business: Business) => {
          // Filter by rating
          if (business.rating && business.rating < rating[0]) return false
          // Filter by verified status
          if (verifiedOnly && !business.isVerified) return false
          // Distance filtering would be handled here if we had location data
          return true
        })
        
        if (onFiltersApplied) {
          onFiltersApplied(filteredBusinesses)
        }
      }
      
      // Close the filter sheet if provided
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error("Error applying filters:", error)
      toast.error("Failed to apply filters. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4 h-full flex flex-col">
      <SheetHeader className="px-1">
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>Refine your search results</SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-auto py-6 space-y-8">
        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                />
                <Label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Minimum Rating</h3>
            <span className="font-medium">{rating[0]}+</span>
          </div>
          <Slider defaultValue={[4]} max={5} min={1} step={0.5} value={rating} onValueChange={setRating} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
          </div>
        </div>

        {/* Distance */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Distance</h3>
            <span className="font-medium">{distance[0]} miles</span>
          </div>
          <Slider defaultValue={[10]} max={50} min={1} step={1} value={distance} onValueChange={setDistance} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 mi</span>
            <span>25 mi</span>
            <span>50 mi</span>
          </div>
        </div>

        {/* Verified Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified-only"
            checked={verifiedOnly}
            onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
          />
          <Label htmlFor="verified-only">Verified businesses only</Label>
        </div>
      </div>

      <SheetFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
        <Button onClick={handleApply} disabled={loading} className="w-full">
          {loading ? "Applying..." : "Apply Filters"}
        </Button>
      </SheetFooter>
    </div>
  )
}
