import { useState, useEffect } from "react"
import { businessApi, reviewApi, userApi } from "@/lib/api"

interface Activity {
  id: string
  type: 'approval' | 'rejection' | 'flag' | 'review' | 'user' | 'business' | 'system'
  action: string
  user: string
  target: string
  time: string
  details?: string
  status?: 'pending' | 'completed' | 'failed'
  priority?: 'low' | 'medium' | 'high'
}

interface ActivityFilters {
  searchTerm: string
  filterType: string
  page: number
  limit: number
}

export const useAdminActivity = (filters: ActivityFilters) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      setError(null)

      try {
        const allActivities: Activity[] = []

        // Fetch business activities (approvals, rejections)
        try {
          const businessesResponse = await businessApi.getAllBusinesses()
          if (businessesResponse.data) {
            businessesResponse.data.forEach((business, index) => {
              // Create activity for business registration
              allActivities.push({
                id: `business-${business.id}`,
                type: 'business',
                action: 'Business registered',
                user: `Business Owner (${business.id})`,
                target: business.businessName,
                time: new Date(business.createdAt).toLocaleDateString(),
                status: business.status === 'pending' ? 'pending' : 'completed',
                priority: business.status === 'pending' ? 'high' : 'low'
              })

              // Create activity for business status changes
              if (business.status === 'approved') {
                allActivities.push({
                  id: `business-approved-${business.id}`,
                  type: 'approval',
                  action: 'Business approved',
                  user: 'Admin',
                  target: business.businessName,
                  time: new Date(business.updatedAt).toLocaleDateString(),
                  status: 'completed',
                  priority: 'medium'
                })
              } else if (business.status === 'rejected') {
                allActivities.push({
                  id: `business-rejected-${business.id}`,
                  type: 'rejection',
                  action: 'Business rejected',
                  user: 'Admin',
                  target: business.businessName,
                  time: new Date(business.updatedAt).toLocaleDateString(),
                  status: 'completed',
                  priority: 'high'
                })
              }
            })
          }
        } catch (error) {
          console.error('Error fetching business activities:', error)
        }

        // Fetch review activities
        try {
          const reviewsResponse = await reviewApi.getAllReviews()
          if (reviewsResponse.data) {
            reviewsResponse.data.forEach((review) => {
              if (review.isFlagged) {
                allActivities.push({
                  id: `review-flagged-${review.id}`,
                  type: 'flag',
                  action: 'Review flagged',
                  user: 'System',
                  target: `Review #${review.id}`,
                  time: new Date(review.createdAt).toLocaleDateString(),
                  details: review.flagReason || 'Inappropriate content detected',
                  status: 'pending',
                  priority: 'high'
                })
              }

              if (review.status === 'approved') {
                allActivities.push({
                  id: `review-approved-${review.id}`,
                  type: 'review',
                  action: 'Review approved',
                  user: 'Admin',
                  target: `Review #${review.id}`,
                  time: new Date(review.createdAt).toLocaleDateString(),
                  status: 'completed',
                  priority: 'medium'
                })
              } else if (review.status === 'rejected') {
                allActivities.push({
                  id: `review-rejected-${review.id}`,
                  type: 'rejection',
                  action: 'Review rejected',
                  user: 'Admin',
                  target: `Review #${review.id}`,
                  time: new Date(review.createdAt).toLocaleDateString(),
                  status: 'completed',
                  priority: 'medium'
                })
              }
            })
          }
        } catch (error) {
          console.error('Error fetching review activities:', error)
        }

        // Fetch user activities
        try {
          const usersResponse = await userApi.getAllUsers()
          if (usersResponse.data) {
            usersResponse.data.forEach((user) => {
              allActivities.push({
                id: `user-${user.id}`,
                type: 'user',
                action: 'User registered',
                user: 'System',
                target: user.email,
                time: new Date().toLocaleDateString(), // Assuming registration time
                status: 'completed',
                priority: 'low'
              })
            })
          }
        } catch (error) {
          console.error('Error fetching user activities:', error)
        }

        // Sort activities by time (newest first)
        allActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

        // Apply filters
        let filteredActivities = allActivities.filter(activity => {
          const matchesSearch = activity.action.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                               activity.user.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                               activity.target.toLowerCase().includes(filters.searchTerm.toLowerCase())
          
          const matchesType = filters.filterType === 'all' || activity.type === filters.filterType
          
          return matchesSearch && matchesType
        })

        // Calculate pagination
        const totalItems = filteredActivities.length
        const totalPages = Math.ceil(totalItems / filters.limit)
        const startIndex = (filters.page - 1) * filters.limit
        const endIndex = startIndex + filters.limit
        const paginatedActivities = filteredActivities.slice(startIndex, endIndex)

        setActivities(paginatedActivities)
        setTotalPages(totalPages)
        setTotalActivities(totalItems)

      } catch (error) {
        console.error('Error fetching activities:', error)
        setError('Failed to load activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [filters.searchTerm, filters.filterType, filters.page, filters.limit])

  return {
    activities,
    loading,
    error,
    totalPages,
    totalActivities
  }
} 