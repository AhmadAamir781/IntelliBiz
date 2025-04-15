import { Business } from "@/services/businessService"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

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

interface BusinessCardProps {
  business: Business
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={business.image}
          alt={business.name}
          className="object-cover w-full h-full"
        />
        {business.verified && (
          <Badge className="absolute top-2 right-2 bg-blue-500">
            Verified
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{business.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
            {business.rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            ({business.reviewCount} reviews)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{business.description}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">Category:</span> {business.category}
          </p>
          <p className="text-sm">
            <span className="font-medium">Address:</span> {business.address}
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span> {business.phone}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Badge variant="outline" className="text-sm">
          {business.category}
        </Badge>
      </CardFooter>
    </Card>
  )
}

