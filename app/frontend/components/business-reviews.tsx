"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { reviewApi } from "@/lib/api"
import { Review } from "@/lib/types"

interface BusinessReviewsProps {
  businessId: number
}

export function BusinessReviews({ businessId }: BusinessReviewsProps) {
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [averageRating, setAverageRating] = useState(0)

  // Fetch reviews when component mounts or businessId changes
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await reviewApi.getReviewsByBusiness(businessId);
        if (response.data) {
          setReviews(response.data);
          
          // Calculate average rating
          if (response.data.length > 0) {
            const sum = response.data.reduce((acc, review) => acc + review.rating, 0);
            setAverageRating(parseFloat((sum / response.data.length).toFixed(1)));
          }
        } else {
          setError("Failed to load reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [businessId]);

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleRatingHover = (value: number) => {
    setHoveredRating(value)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const handleSubmitReview = async () => {
    if (rating === 0 || !newReview.trim()) {
      alert("Please provide a rating and review content");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create review data according to API requirements
      const reviewData = {
        userId: 0, // This would normally come from the authenticated user
        businessId: businessId,
        rating: rating,
        comment: newReview,
        isFlagged: false,
        status: 'pending' as const,
      };

      console.log("Submitting review:", reviewData);
      
      const response = await reviewApi.createReview(reviewData);
      debugger
      console.log("Review submission response:", response);
      
      // Consider the review submission successful even if response.success is false
      // but there's a response.data object (which indicates the data was saved)
      if (response.data) {
        // Add the new review to the list
        setReviews([response.data, ...reviews]);
        
        // Recalculate average rating
        const newTotal = reviews.reduce((acc, review) => acc + review.rating, 0) + rating;
        setAverageRating(parseFloat((newTotal / (reviews.length + 1)).toFixed(1)));
        
        // Reset form
        setNewReview("");
        setRating(0);
        
        alert("Thank you for your review! It will be visible after moderation.");
        return;
      }
      
      // If we got here, there was no data in the response, check if success is true
      if (response.success) {
        // Refresh reviews to get the newly submitted one
        const refreshResponse = await reviewApi.getReviewsByBusiness(businessId);
        if (refreshResponse.success && refreshResponse.data) {
          setReviews(refreshResponse.data);
          
          // Recalculate average rating
          if (refreshResponse.data.length > 0) {
            const sum = refreshResponse.data.reduce((acc, review) => acc + review.rating, 0);
            setAverageRating(parseFloat((sum / refreshResponse.data.length).toFixed(1)));
          }
        }
        
        // Reset form
        setNewReview("");
        setRating(0);
        
        alert("Thank you for your review! It will be visible after moderation.");
      } else {
        // Real error case - show the error message from the response
        setError(response.message || "Failed to submit review");
        
        // Check if we should attempt to reload reviews anyway
        // Sometimes the review saves but the API still returns an error
        setTimeout(async () => {
          try {
            const checkResponse = await reviewApi.getReviewsByBusiness(businessId);
            if (checkResponse.success && checkResponse.data) {
              setReviews(checkResponse.data);
              
              // Recalculate average rating
              if (checkResponse.data.length > 0) {
                const sum = checkResponse.data.reduce((acc, review) => acc + review.rating, 0);
                setAverageRating(parseFloat((sum / checkResponse.data.length).toFixed(1)));
              }
            }
          } catch (err) {
            console.error("Error checking for new reviews:", err);
          }
        }, 2000); // Wait 2 seconds before checking
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again later.");
      
      // Also try to refresh reviews in case the review was saved despite the error
      setTimeout(async () => {
        try {
          const refreshResponse = await reviewApi.getReviewsByBusiness(businessId);
          if (refreshResponse.success && refreshResponse.data) {
            setReviews(refreshResponse.data);
            
            // Recalculate average rating
            if (refreshResponse.data.length > 0) {
              const sum = refreshResponse.data.reduce((acc, review) => acc + review.rating, 0);
              setAverageRating(parseFloat((sum / refreshResponse.data.length).toFixed(1)));
            }
          }
        } catch (refreshErr) {
          console.error("Error refreshing reviews:", refreshErr);
        }
      }, 2000); // Wait 2 seconds before refreshing
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleHelpfulClick = (reviewId: string | number | undefined) => {
    // Check if reviewId is defined before proceeding
    if (reviewId === undefined) return;
    
    const reviewIdString = reviewId.toString();
    if (helpfulReviews.includes(reviewIdString)) {
      setHelpfulReviews(helpfulReviews.filter((id) => id !== reviewIdString));
    } else {
      setHelpfulReviews([...helpfulReviews, reviewIdString]);
    }
  }

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // For ratings 1-5
    
    reviews.forEach(review => {
      const ratingIndex = Math.floor(review.rating) - 1;
      if (ratingIndex >= 0 && ratingIndex < 5) {
        distribution[ratingIndex]++;
      }
    });
    
    return distribution.reverse(); // Return in order 5-1
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center md:w-1/3">
              <div className="text-5xl font-bold">{averageRating}</div>
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : ""} 
                    ${i === Math.floor(averageRating) && averageRating % 1 > 0 ? "text-yellow-400 fill-yellow-400 opacity-80" : ""}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} reviews</p>
            </div>

            <div className="flex-1">
              <h3 className="font-medium mb-3">Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((star, index) => {
                const count = ratingDistribution[index];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 w-16">
                      <span>{star}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-sm text-muted-foreground w-10">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write a Review */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>
          <div className="flex items-center gap-2 mb-4">
            <span>Your rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => handleRatingHover(value)}
                  onMouseLeave={handleRatingLeave}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${value <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted fill-none"
                      }`}
                    stroke="black"
                  />

                </button>
              ))}
            </div>
          </div>
          <Textarea
            placeholder="Share your experience with this business..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="min-h-[120px] mb-4"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <Button 
            onClick={handleSubmitReview} 
            disabled={isSubmitting || rating === 0 || !newReview.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">Loading reviews...</CardContent>
        </Card>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">No reviews yet. Be the first to leave a review!</CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.userAvatar || "/placeholder.svg?height=40&width=40"} alt={review.userName || "User"} />
                    {/* <AvatarFallback>{review.userName ? review.userName.charAt(0) : "U"}</AvatarFallback> */}
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{review.userName || "Anonymous"}</h4>
                        <p className="text-sm text-muted-foreground">Verified Customer</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3">{review.comment}</p>

                    <div className="flex items-center gap-4 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-1 ${review.id && helpfulReviews.includes(review.id.toString()) ? "text-primary" : ""}`}
                        onClick={() => handleHelpfulClick(review.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.id && helpfulReviews.includes(review.id.toString()) ? 1 : 0})
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Flag className="h-4 w-4" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reviews.length > 5 && (
        <div className="flex justify-center">
          <Button variant="outline">Load More Reviews</Button>
        </div>
      )}
    </div>
  )
}

