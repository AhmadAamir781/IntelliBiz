"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Star, ThumbsUp, Flag } from "lucide-react"

// Mock data for reviews
const reviews = [
  {
    id: "1",
    user: {
      name: "John D.",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "New York, NY",
    },
    rating: 5,
    date: "2023-05-15",
    content:
      "Excellent service! They arrived on time and fixed our plumbing issue quickly. Very professional and knowledgeable. I would definitely use their services again and recommend them to others.",
    helpful: 12,
    reply: {
      name: "Smith Plumbing",
      content:
        "Thank you for your kind words, John! We're glad we could help with your plumbing issue. We appreciate your business and look forward to serving you again in the future.",
      date: "2023-05-16",
    },
  },
  {
    id: "2",
    user: {
      name: "Sarah M.",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Brooklyn, NY",
    },
    rating: 4,
    date: "2023-04-28",
    content:
      "Good service overall. They fixed our leaky faucet and were very thorough. The only reason I'm not giving 5 stars is because they were about 30 minutes late for the appointment. Otherwise, the work quality was excellent.",
    helpful: 8,
    reply: null,
  },
  {
    id: "3",
    user: {
      name: "Michael T.",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Queens, NY",
    },
    rating: 5,
    date: "2023-04-10",
    content:
      "I had a major pipe burst in my basement and called Smith Plumbing for emergency service. They arrived within an hour and worked efficiently to fix the issue. They even helped clean up the water damage. Highly recommend!",
    helpful: 15,
    reply: {
      name: "Smith Plumbing",
      content:
        "Thank you for trusting us with your emergency, Michael! We understand how stressful plumbing emergencies can be and always aim to provide prompt and effective service. We appreciate your recommendation!",
      date: "2023-04-11",
    },
  },
]

interface BusinessReviewsProps {
  businessId: string
}

export function BusinessReviews({ businessId }: BusinessReviewsProps) {
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleRatingHover = (value: number) => {
    setHoveredRating(value)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const handleSubmitReview = () => {
    if (rating === 0 || !newReview.trim()) {
      alert("Please provide a rating and review content")
      return
    }

    console.log("Submitting review:", {
      businessId,
      rating,
      content: newReview,
    })

    // Reset form
    setNewReview("")
    setRating(0)
  }

  const handleHelpfulClick = (reviewId: string) => {
    if (helpfulReviews.includes(reviewId)) {
      setHelpfulReviews(helpfulReviews.filter((id) => id !== reviewId))
    } else {
      setHelpfulReviews([...helpfulReviews, reviewId])
    }
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center md:w-1/3">
              <div className="text-5xl font-bold">4.8</div>
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : ""} ${
                      i === 4 ? "text-yellow-400 fill-yellow-400 opacity-80" : ""
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} reviews</p>
            </div>

            <div className="flex-1">
              <h3 className="font-medium mb-3">Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => Math.floor(r.rating) === star).length
                const percentage = (count / reviews.length) * 100

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
                    className={`h-6 w-6 ${
                      value <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-muted"
                    }`}
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
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{review.user.name}</h4>
                      <p className="text-sm text-muted-foreground">{review.user.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3">{review.content}</p>

                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 ${helpfulReviews.includes(review.id) ? "text-primary" : ""}`}
                      onClick={() => handleHelpfulClick(review.id)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({helpfulReviews.includes(review.id) ? review.helpful + 1 : review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Flag className="h-4 w-4" />
                      Report
                    </Button>
                  </div>

                  {review.reply && (
                    <div className="mt-4 pl-4 border-l-2 border-muted">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{review.reply.name}</h5>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.reply.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{review.reply.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  )
}

