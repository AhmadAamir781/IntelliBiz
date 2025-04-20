"use client"

import { useState, useEffect } from "react"
import { BusinessCard } from "@/components/business-card"
import { businessApi } from "@/lib/api"
import { Business } from "@/lib/types"

export function FeaturedBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedBusinesses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use the getAllBusinesses API to fetch businesses
        const response = await businessApi.getAllBusinesses();
        
        if (response.data) {
          // Sort by rating and take top 3 or 6 businesses
          const featuredBusinesses = response.data
            .filter(business => business.isVerified)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);
            
          setBusinesses(featuredBusinesses);
        } else {
          setError("Failed to fetch featured businesses");
        }
      } catch (error) {
        console.error("Error fetching featured businesses:", error);
        setError("An error occurred while fetching businesses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedBusinesses();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-[300px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (businesses.length === 0) {
    return <div className="text-center">No featured businesses found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  )
}
