import { BusinessCard } from "@/components/business-card"

// Mock data for featured businesses
const featuredBusinesses = [
  {
    id: "1",
    name: "Smith Plumbing Services",
    category: "Plumbing",
    rating: 4.8,
    reviewCount: 124,
    description: "Professional plumbing services with 15+ years of experience.",
    address: "123 Main St, New York, NY",
    phone: "(555) 123-4567",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "2",
    name: "Elite Electrical Solutions",
    category: "Electrical",
    rating: 4.6,
    reviewCount: 98,
    description: "Licensed electricians providing residential and commercial services.",
    address: "456 Oak Ave, New York, NY",
    phone: "(555) 234-5678",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
    verified: true,
  },
  {
    id: "3",
    name: "Green Thumb Landscaping",
    category: "Landscaping",
    rating: 4.9,
    reviewCount: 156,
    description: "Complete landscaping services including lawn care and garden design.",
    address: "789 Pine Rd, New York, NY",
    phone: "(555) 345-6789",
    image: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?q=80&w=600&auto=format&fit=crop",
    verified: false,
  },
]

export function FeaturedBusinesses() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredBusinesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  )
}
