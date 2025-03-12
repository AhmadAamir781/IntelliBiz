import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, CheckCircle2 } from "lucide-react"

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
        <Card
          key={business.id}
          className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative aspect-video">
            <img
              src={business.image || "/placeholder.svg"}
              alt={business.name}
              className="object-cover w-full h-full"
            />
            {business.verified && (
              <Badge
                variant="outline"
                className="absolute top-2 right-2 bg-white text-primary border-primary flex items-center gap-1"
              >
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <CardContent className="p-4 flex-1 flex flex-col">
            <div className="mb-2">
              <Badge variant="outline" className="bg-accent text-accent-foreground">
                {business.category}
              </Badge>
            </div>
            <h3 className="font-medium text-lg mb-1">{business.name}</h3>
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(business.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : i < business.rating
                          ? "text-yellow-400 fill-yellow-400 opacity-50"
                          : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">{business.rating}</span>
              <span className="text-sm text-muted-foreground">({business.reviewCount})</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{business.description}</p>
            <div className="space-y-2 mt-auto">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground truncate">{business.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{business.phone}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button className="flex-1" asChild>
                <Link href={`/businesses/${business.id}`}>View Details</Link>
              </Button>
              <Button variant="outline" className="flex-1">
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

