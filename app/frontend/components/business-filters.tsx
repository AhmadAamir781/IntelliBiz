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



interface BusinessFiltersProps {
  onFiltersApplied?: (businesses: Business[]) => void
  onClose?: () => void
}

export function BusinessFilters({ onFiltersApplied, onClose }: BusinessFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [rating, setRating] = useState([4])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await businessApi.getAllCategories();
        if (response.data) {
          // Remove duplicates and ensure unique categories
          const uniqueCategories = [...new Set(response.data)];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, []);
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
      
      // Get all businesses first
      const response = await businessApi.getAllBusinesses()
      let allBusinesses = response.data || []
      
      // Apply category filter
      if (selectedCategories.length > 0) {
        allBusinesses = allBusinesses.filter((business: Business) => 
          selectedCategories.includes(business.category)
        )
      }
      
      // Apply rating filter
      allBusinesses = allBusinesses.filter((business: Business) => {
        if (business.rating && business.rating < rating[0]) return false
        return true
      })
      
      // Apply verified filter
      if (verifiedOnly) {
        allBusinesses = allBusinesses.filter((business: Business) => business.isVerified)
      }
      
      // Distance filtering would be handled here if we had location data
      // For now, we'll skip distance filtering
      
      if (onFiltersApplied) {
        onFiltersApplied(allBusinesses)
      }
      
      // Close the filter sheet
      if (onClose) {
        onClose()
      }
      
      toast.success(`Found ${allBusinesses.length} businesses matching your criteria`)
      
    } catch (error) {
      console.error("Error applying filters:", error)
      toast.error("Failed to apply filters. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const hasActiveFilters = selectedCategories.length > 0 || rating[0] !== 4 || verifiedOnly || distance[0] !== 10

  return (
    <div className="py-4 h-full flex flex-col">
      <SheetHeader className="px-1 flex justify-between items-start">
        <div>
          <SheetTitle className="flex items-center gap-2">
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </SheetTitle>
          <SheetDescription>Refine your search results</SheetDescription>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-auto py-6 space-y-8">
        {/* Categories */}
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {categories.map((category, index) => (
              <div key={`${category}-${index}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}-${index}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked === true)}
                />
                <Label htmlFor={`category-${category}-${index}`} className="text-sm">
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
