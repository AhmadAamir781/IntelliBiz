import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BusinessCard } from "@/components/business-card"
import { BusinessFilters } from "@/components/business-filters"
import { Search, MapPin, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Mock data for businesses
const businesses = [
  {
    id: "1",
    name: "Smith Plumbing Services",
    category: "Plumbing",
    rating: 4.8,
    reviewCount: 124,
    description:
      "Professional plumbing services with 15+ years of experience. Specializing in repairs, installations, and emergency services.",
    address: "123 Main St, New York, NY",
    phone: "(555) 123-4567",
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: "2",
    name: "Elite Electrical Solutions",
    category: "Electrical",
    rating: 4.6,
    reviewCount: 98,
    description:
      "Licensed electricians providing residential and commercial electrical services. Available 24/7 for emergencies.",
    address: "456 Oak Ave, New York, NY",
    phone: "(555) 234-5678",
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: "3",
    name: "Green Thumb Landscaping",
    category: "Landscaping",
    rating: 4.9,
    reviewCount: 156,
    description:
      "Complete landscaping services including lawn care, garden design, tree trimming, and seasonal maintenance.",
    address: "789 Pine Rd, New York, NY",
    phone: "(555) 345-6789",
    image: "/placeholder.svg?height=300&width=300",
    verified: false,
  },
  {
    id: "4",
    name: "Precision Auto Repair",
    category: "Automotive",
    rating: 4.7,
    reviewCount: 112,
    description:
      "Full-service auto repair shop with certified mechanics. Specializing in domestic and foreign vehicles.",
    address: "101 Maple Dr, New York, NY",
    phone: "(555) 456-7890",
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: "5",
    name: "Sparkle Cleaning Services",
    category: "Cleaning",
    rating: 4.5,
    reviewCount: 87,
    description:
      "Professional cleaning services for homes and businesses. Regular cleaning, deep cleaning, and move-in/move-out services.",
    address: "202 Elm St, New York, NY",
    phone: "(555) 567-8901",
    image: "/placeholder.svg?height=300&width=300",
    verified: true,
  },
  {
    id: "6",
    name: "Master Carpentry",
    category: "Carpentry",
    rating: 4.8,
    reviewCount: 103,
    description: "Custom carpentry and woodworking. Specializing in cabinets, furniture, and home renovations.",
    address: "303 Cedar Ln, New York, NY",
    phone: "(555) 678-9012",
    image: "/placeholder.svg?height=300&width=300",
    verified: false,
  },
]

export default function BusinessesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Find Local Businesses</h1>
          <p className="text-muted-foreground">Browse and connect with trusted local service providers in your area</p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search businesses, services..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:max-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Location" className="pl-9" />
            </div>
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
            Showing <span className="font-medium text-foreground">{businesses.length}</span> businesses
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select className="text-sm border rounded-md px-2 py-1 bg-background">
              <option>Relevance</option>
              <option>Rating: High to Low</option>
              <option>Rating: Low to High</option>
              <option>Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
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

