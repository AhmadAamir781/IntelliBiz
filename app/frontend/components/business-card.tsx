import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, CheckCircle2 } from "lucide-react"
import { Business as ApiBusinessType } from "@/lib/types"

// Business category images mapping
const categoryImages = {
  Plumbing: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=600&auto=format&fit=crop",
  Electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
  Carpentry: "https://images.unsplash.com/photo-1601564921647-b446839a013f?q=80&w=600&auto=format&fit=crop",
  Cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop",
  Landscaping: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?q=80&w=600&auto=format&fit=crop",
  Automotive: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=600&auto=format&fit=crop",
  "Beauty & Wellness": "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=600&auto=format&fit=crop",
  "Food & Catering": "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
}

// Type for the business card that can accept both our mock data and API business data
interface BusinessCardProps {
  business: ApiBusinessType
}

export function BusinessCard({ business }: BusinessCardProps) {
  // Get image based on category or use provided image or default
  const imageUrl =
    business.imageUrl || categoryImages[business.category as keyof typeof categoryImages] || categoryImages.default

  // Calculate how many reviews based on either reviewCount from mock data or actual data
  const reviewCount = 0; // Default to 0 as the API doesn't provide this directly

  // Format the address from the components in the API data
  const formattedAddress = `${business.address}, ${business.city}, ${business.state} ${business.zipCode}`;

  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <div className="relative aspect-video">
        <img src={imageUrl || "/placeholder.svg"} alt={business.name} className="object-cover w-full h-full" />
        {business.isVerified && (
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
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{business.description}</p>
        <div className="space-y-2 mt-auto">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground truncate">{formattedAddress}</span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground">{business.phoneNumber}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button className="w-full" asChild>
            <Link href={`/businesses/${business.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" className="w-full">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
