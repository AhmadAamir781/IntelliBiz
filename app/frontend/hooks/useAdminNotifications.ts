import { useState, useEffect } from "react"
import { businessApi, reviewApi } from "@/lib/api"

interface Notification {
  id: string
  type: 'business' | 'review' | 'system' | 'user'
  title: string
  message: string
  time: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = async () => {
    try {
      const allNotifications: Notification[] = []

      // Fetch pending businesses for notifications
      try {
        const businessesResponse = await businessApi.getAllBusinesses()
        if (businessesResponse.data) {
          const pendingBusinesses = businessesResponse.data.filter(b => b.status === 'pending')
          
          pendingBusinesses.forEach((business) => {
            allNotifications.push({
              id: `business-pending-${business.id}`,
              type: 'business',
              title: 'New Business Registration',
              message: `${business.businessName} is waiting for approval`,
              time: new Date(business.createdAt).toLocaleDateString(),
              isRead: false,
              priority: 'high',
              actionUrl: `/admin/businesses/review/${business.id}`
            })
          })
        }
      } catch (error) {
        console.error('Error fetching business notifications:', error)
      }

      // Fetch flagged reviews for notifications
      try {
        const reviewsResponse = await reviewApi.getFlaggedReviews()
        if (reviewsResponse.data) {
          reviewsResponse.data.forEach((review) => {
            allNotifications.push({
              id: `review-flagged-${review.id}`,
              type: 'review',
              title: 'Review Flagged',
              message: `Review #${review.id} has been flagged for moderation`,
              time: new Date(review.createdAt).toLocaleDateString(),
              isRead: false,
              priority: 'high',
              actionUrl: `/admin/reviews/${review.id}`
            })
          })
        }
      } catch (error) {
        console.error('Error fetching review notifications:', error)
      }

      // Fetch pending reviews
      try {
        const pendingReviewsResponse = await reviewApi.getPendingReviews()
        if (pendingReviewsResponse.data) {
          pendingReviewsResponse.data.forEach((review) => {
            allNotifications.push({
              id: `review-pending-${review.id}`,
              type: 'review',
              title: 'Review Pending Approval',
              message: `Review #${review.id} is waiting for approval`,
              time: new Date(review.createdAt).toLocaleDateString(),
              isRead: false,
              priority: 'medium',
              actionUrl: `/admin/reviews/${review.id}`
            })
          })
        }
      } catch (error) {
        console.error('Error fetching pending review notifications:', error)
      }

      try {
        const pendingReviewsResponse = await reviewApi.getPublishedReviews()
        if (pendingReviewsResponse.data) {
          pendingReviewsResponse.data.forEach((review) => {
            allNotifications.push({
              id: `review-pending-${review.id}`,
              type: 'review',
              title: 'Review published',
              message: `Review #${review.id} is published`,
              time: new Date(review.createdAt).toLocaleDateString(),
              isRead: false,
              priority: 'medium',
              actionUrl: `/admin/reviews/${review.id}`
            })
          })
        }
      } catch (error) {
        console.error('Error fetching published review notifications:', error)
      }
      // Sort notifications by priority and time (newest first)
      allNotifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        if (priorityDiff !== 0) return priorityDiff
        return new Date(b.time).getTime() - new Date(a.time).getTime()
      })

      setNotifications(allNotifications)
      setUnreadCount(allNotifications.filter(n => !n.isRead).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'business':
        return '🏢'
      case 'review':
        return '⭐'
      case 'system':
        return '⚙️'
      case 'user':
        return '👤'
      default:
        return '📢'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'business':
        return 'text-blue-600'
      case 'review':
        return 'text-yellow-600'
      case 'system':
        return 'text-gray-600'
      case 'user':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    getNotificationIcon,
    getNotificationColor,
    refresh: fetchNotifications
  }
} 