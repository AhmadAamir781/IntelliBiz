import { useState, useEffect } from "react"
import { businessApi, serviceApi, reviewApi, userApi } from "@/lib/api"
import { Business, Service, Review, User } from "@/lib/types"

interface BusinessReviewData {
  business: Business | null
  services: Service[]
  reviews: Review[]
  owner: User | null
  loading: boolean
  error: string | null
}

export const useBusinessReview = (businessId: string) => {
  const [data, setData] = useState<BusinessReviewData>({
    business: null,
    services: [],
    reviews: [],
    owner: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchBusinessReviewData = async () => {
      if (!businessId) return

      setData(prev => ({ ...prev, loading: true, error: null }))

      try {
        // Fetch all data in parallel
        const [businessResponse, servicesResponse, reviewsResponse] = await Promise.all([
          businessApi.getBusinessDetail(parseInt(businessId)),
          serviceApi.getServicesByBusiness(parseInt(businessId)),
          reviewApi.getReviewsByBusiness(parseInt(businessId))
        ])

        const business = businessResponse.data
        const services = servicesResponse.data || []
        const reviews = reviewsResponse.data || []

        // Fetch owner data if business has ownerId
        let owner = null
        if (business?.ownerId) {
          try {
            const ownerResponse = await userApi.getProfile(business.ownerId)
            owner = ownerResponse.data
          } catch (error) {
            console.error('Error fetching owner data:', error)
            // Don't fail the entire request if owner fetch fails
          }
        }

        setData({
          business,
          services,
          reviews,
          owner,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching business review data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load business data'
        }))
      }
    }

    fetchBusinessReviewData()
  }, [businessId])

  const updateBusinessStatus = async (status: 'approved' | 'rejected') => {
    if (!data.business) return

    try {
      const response = await businessApi.updateBusiness(data.business.id, { status })
      if (response.data) {
        // Update local state
        setData(prev => ({
          ...prev,
          business: response.data
        }))
        return { success: true, data: response.data }
      }
    } catch (error) {
      console.error('Error updating business status:', error)
      return { success: false, error: 'Failed to update business status' }
    }
  }

  return {
    ...data,
    updateBusinessStatus
  }
} 