"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build the search query
    const searchParams = new URLSearchParams()
    if (query) searchParams.set("q", query)
    if (location) searchParams.set("location", location)

    // Navigate to the businesses page with the search parameters
    router.push(`/businesses?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for services, businesses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-white text-foreground"
          />
        </div>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9 bg-white text-foreground"
          />
        </div>
        <Button type="submit" className="shrink-0">
          Search
        </Button>
      </div>
    </form>
  )
}

