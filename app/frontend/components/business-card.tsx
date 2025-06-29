import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, CheckCircle2, Building } from "lucide-react"
import { Business as ApiBusinessType, Review } from "@/lib/types"
import { reviewApi } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

// Extended business type that includes reviewCount
interface BusinessWithReviewCount extends ApiBusinessType {
  reviewCount?: number;
}

// Business category images mapping
const categoryImages = {
  Electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop",
  Carpentry: "https://servicemarketwp.imgix.net/wp-content/uploads/2018/10/types-carpentry-services-dubai-450x250.jpg?q=80&w=600&auto=format&fit=crop",
  "Home Services": "https://img.freepik.com/premium-photo/close-up-repairman-uniform-standing-home-kitchen-holding-his-tool-bag_673498-2375.jpg?semt=ais_hybrid&w=740",
  Gardening: "https://www.nationaldaycalendar.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cg_faces:center%2Cq_auto:eco%2Cw_768/MjA1MTEyMTE4OTk4MDE3NjY4/website-feature---national-gardening-day--april-14.png?q=80&w=600&auto=format&fit=crop",
  "IT Services": "https://img.freepik.com/free-photo/people-working-while-respecting-social-distancing-restriction_23-2148961749.jpg?semt=ais_hybrid&w=740",
  "Automobile Services": "https://t4.ftcdn.net/jpg/05/21/93/17/360_F_521931702_TXOHZBa3tLVISome894Zc061ceab4Txm.jpg?q=80&w=600&auto=format&fit=crop",
  Education: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=600&auto=format&fit=crop",
  "Interior Design": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
  "IT & Technology": "https://burst.shopifycdn.com/photos/tech-meeting-flatlay.jpg?width=1000&format=pjpg&exif=0&iptc=0",
  default: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=600&auto=format&fit=crop",
};

// Type for the business card that can accept both our mock data and API business data
interface BusinessCardProps {
  business: BusinessWithReviewCount
}

export function BusinessCard({ business }: BusinessCardProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { user } = useAuth();
  
  // Check if the current user owns this business
  const isOwnedByUser = user && business.ownerId === user.id;
  
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
    <Card className={`overflow-hidden h-full flex flex-col shadow-md hover:shadow-lg transition-all border rounded-lg ${
      isOwnedByUser 
        ? 'border-primary/30 bg-primary/5 shadow-primary/10' 
        : 'border-border'
    }`}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={business.businessName} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {isOwnedByUser && (
          <Badge
            variant="outline"
            className="absolute top-2 left-2 bg-primary text-primary-foreground border-primary flex items-center gap-1 shadow-sm backdrop-blur-sm z-10"
          >
            <Building className="h-3 w-3" />
            Your Business
          </Badge>
        )}
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
        <h3 className="font-semibold text-lg mb-1 text-foreground">{business.businessName}</h3>
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
          <Button asChild variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/5 hover:text-primary">
            <Link href={`/businesses/${business.id}/contact`}>
              Contact
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
