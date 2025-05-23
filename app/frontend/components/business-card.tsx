import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, CheckCircle2 } from "lucide-react"
import { Business as ApiBusinessType, Review } from "@/lib/types"
import { reviewApi } from "@/lib/api"

// Extended business type that includes reviewCount
interface BusinessWithReviewCount extends ApiBusinessType {
  reviewCount?: number;
}

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
  business: BusinessWithReviewCount
}

export function BusinessCard({ business }: BusinessCardProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await reviewApi.getReviewsByBusiness(business.id);
        if (response.data) {
          setReviews(response.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    
    fetchReviews();
  }, [business.id]);
  
  // Get image based on category or use provided image or default
  const imageUrl =
    business.imageUrl || categoryImages[business.category as keyof typeof categoryImages] || categoryImages.default

  // Use either provided reviewCount or calculate from fetched reviews
  const reviewCount = reviews.length;
  
  // Calculate average rating from reviews
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : business.rating || 0;
  
  // Format the address from the components in the API data
  const formattedAddress = `${business.address}, ${business.city}, ${business.state} ${business.zipCode}`;

  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-all border border-border group rounded-lg">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={business.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {business.isVerified && (
          <Badge
            variant="outline"
            className="absolute top-2 right-2 bg-white/90 text-primary border-primary flex items-center gap-1 shadow-sm backdrop-blur-sm"
          >
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-2 flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-accent text-accent-foreground">
            {business.category}
          </Badge>
          {business.isVerified && (
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              Verified
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-1 text-foreground">{business.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(averageRating)
                    ? "text-orange-400 fill-orange-400"
                    : i < averageRating
                      ? "text-orange-400 fill-orange-400 opacity-50"
                      : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviewCount})</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{business.description}</p>
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
        <div className="grid grid-cols-2 gap-2 mt-5">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
            <Link href={`/businesses/${business.id}`}>View Details</Link>
          </Button>
          <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
