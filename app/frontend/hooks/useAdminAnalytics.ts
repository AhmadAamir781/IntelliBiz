import { useState, useEffect, useCallback, useRef } from 'react'
import { businessApi, userApi, reviewApi } from '@/lib/api'
import { toast } from 'sonner'

interface AnalyticsData {
  overview: {
    totalBusinesses: number
    totalUsers: number
    totalReviews: number
    totalMessages: number
    businessGrowth: number
    userGrowth: number
    reviewGrowth: number
    messageGrowth: number
  }
  businessMetrics: {
    byCategory: Array<{ category: string; count: number }>
    byStatus: Array<{ status: string; count: number }>
    topBusinesses: Array<{ name: string; reviews: number; rating: number }>
  }
  userMetrics: {
    byRole: Array<{ role: string; count: number }>
    registrations: Array<{ date: string; count: number }>
    activeUsers: number
  }
  reviewMetrics: {
    byRating: Array<{ rating: number; count: number }>
    byStatus: Array<{ status: string; count: number }>
    averageRating: number
  }
}

export const useAdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Use refs to track state that shouldn't trigger re-renders
  const lastFetchRef = useRef<number>(0)
  const isLoadingRef = useRef<boolean>(false)

  const calculateBusinessByCategory = useCallback((businesses: any[]) => {
    const categoryCount: { [key: string]: number } = {}
    businesses.forEach(business => {
      const category = business.category || 'Unknown'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })
    return Object.entries(categoryCount).map(([category, count]) => ({ category, count }))
  }, [])

  const calculateBusinessByStatus = useCallback((businesses: any[]) => {
    const statusCount: { [key: string]: number } = {}
    businesses.forEach(business => {
      const status = business.status || 'unknown'
      statusCount[status] = (statusCount[status] || 0) + 1
    })
    return Object.entries(statusCount).map(([status, count]) => ({ status, count }))
  }, [])

  const calculateTopBusinesses = useCallback((businesses: any[], reviews: any[]) => {
    const businessReviews: { [key: string]: any[] } = {}
    reviews.forEach(review => {
      if (!businessReviews[review.businessId]) {
        businessReviews[review.businessId] = []
      }
      businessReviews[review.businessId].push(review)
    })

    return businesses
      .map(business => ({
        name: business.businessName || business.name || 'Unknown Business',
        reviews: businessReviews[business.id]?.length || 0,
        rating: businessReviews[business.id]?.length > 0 
          ? businessReviews[business.id].reduce((sum: number, r: any) => sum + r.rating, 0) / businessReviews[business.id].length
          : 0
      }))
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 5)
  }, [])

  const calculateUsersByRole = useCallback((users: any[]) => {
    const roleCount: { [key: string]: number } = {}
    users.forEach(user => {
      const role = user.role || 'Unknown'
      roleCount[role] = (roleCount[role] || 0) + 1
    })
    return Object.entries(roleCount).map(([role, count]) => ({ role, count }))
  }, [])

  const generateRegistrationData = useCallback((users: any[]) => {
    // Mock registration data for the last 7 days
    const dates = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    
    return dates.map(date => ({
      date,
      count: Math.floor(Math.random() * 10) + 1 // Mock data
    }))
  }, [])

  const calculateReviewsByRating = useCallback((reviews: any[]) => {
    const ratingCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach(review => {
      const rating = review.rating || 0
      if (rating >= 1 && rating <= 5) {
        ratingCount[rating] = (ratingCount[rating] || 0) + 1
      }
    })
    return Object.entries(ratingCount).map(([rating, count]) => ({ rating: parseInt(rating), count }))
  }, [])

  const calculateReviewsByStatus = useCallback((reviews: any[]) => {
    const statusCount: { [key: string]: number } = {}
    reviews.forEach(review => {
      const status = review.status || 'unknown'
      statusCount[status] = (statusCount[status] || 0) + 1
    })
    return Object.entries(statusCount).map(([status, count]) => ({ status, count }))
  }, [])

  const fetchAnalyticsData = useCallback(async (forceRefresh = false) => {
    // Prevent multiple simultaneous requests
    if (isLoadingRef.current && !forceRefresh) return

    // Cache for 5 minutes unless forced refresh
    const now = Date.now()
    if (!forceRefresh && data && (now - lastFetchRef.current) < 5 * 60 * 1000) {
      return
    }

    try {
      isLoadingRef.current = true
      setLoading(true)
      setError(null)
      
      console.log('Fetching analytics data...')
      
      // Fetch all data in parallel
      const [businessesResponse, usersResponse, reviewsResponse] = await Promise.all([
        businessApi.getAllBusinesses(),
        userApi.getAllUsers(),
        reviewApi.getAllReviews()
      ])

      console.log('API Responses:', {
        businesses: businessesResponse,
        users: usersResponse,
        reviews: reviewsResponse
      })

      const businesses = businessesResponse.data || []
      const users = usersResponse.data || []
      const reviews = reviewsResponse.data || []

      console.log('Processed Data:', {
        businessesCount: businesses.length,
        usersCount: users.length,
        reviewsCount: reviews.length
      })

      // Calculate overview metrics
      const overview = {
        totalBusinesses: businesses.length,
        totalUsers: users.length,
        totalReviews: reviews.length,
        totalMessages: 0, // Mock data for now
        businessGrowth: 12.5, // Mock data - replace with actual calculation
        userGrowth: 8.3,
        reviewGrowth: 15.7,
        messageGrowth: 5.2
      }

      // Calculate business metrics
      const businessMetrics = {
        byCategory: calculateBusinessByCategory(businesses),
        byStatus: calculateBusinessByStatus(businesses),
        topBusinesses: calculateTopBusinesses(businesses, reviews)
      }

      // Calculate user metrics
      const userMetrics = {
        byRole: calculateUsersByRole(users),
        registrations: generateRegistrationData(users),
        activeUsers: Math.floor(users.length * 0.75) // Mock data
      }

      // Calculate review metrics
      const reviewMetrics = {
        byRating: calculateReviewsByRating(reviews),
        byStatus: calculateReviewsByStatus(reviews),
        averageRating: reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
      }

      const finalData = {
        overview,
        businessMetrics,
        userMetrics,
        reviewMetrics
      }

      console.log('Final Analytics Data:', finalData)
      setData(finalData)
      lastFetchRef.current = now
      setIsInitialized(true)

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError('Failed to load analytics data')
      toast.error('Failed to load analytics data')
    } finally {
      isLoadingRef.current = false
      setLoading(false)
    }
  }, [
    calculateBusinessByCategory,
    calculateBusinessByStatus,
    calculateTopBusinesses,
    calculateUsersByRole,
    generateRegistrationData,
    calculateReviewsByRating,
    calculateReviewsByStatus
  ])

  const refreshData = useCallback(() => {
    fetchAnalyticsData(true)
  }, [fetchAnalyticsData])

  return {
    data,
    loading,
    error,
    isInitialized,
    fetchAnalyticsData,
    refreshData
  }
} 