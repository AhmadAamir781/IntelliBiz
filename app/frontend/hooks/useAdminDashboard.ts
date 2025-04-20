import { useState, useEffect } from 'react';
import { userApi, businessApi, reviewApi, messageApi } from '@/lib/api';
import { User, Business, ApiResponse } from '@/lib/types';

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalReviews: number;
  totalMessages: number;
  userGrowth: number;
  businessGrowth: number;
  reviewGrowth: number;
  messageGrowth: number;
}

interface ActivityItem {
  id: number;
  type: 'approval' | 'flag' | 'rejection' | 'new';
  action: string;
  user: string;
  target: string;
  time: string;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all necessary data in parallel
        const [usersResponse, businessesResponse, reviewsResponse, messagesResponse] = await Promise.all([
          userApi.getAllUsers(),
          businessApi.getAllBusinesses(),
          reviewApi.getAllReviews(),
          messageApi.getAllMessages(),
        ]);

        // Extract data from responses
        const users = usersResponse.data || [];
        const businesses = businessesResponse.data || [];
        const reviews = reviewsResponse.data || [];
        const messages = messagesResponse.data || [];

        // Find pending businesses
        const pending = businesses.filter(business => business.status === 'pending' || !business.isVerified);
        setPendingBusinesses(pending);

        // Generate mock growth data (would be replaced with real data from API)
        const mockGrowthData = {
          userGrowth: 8,
          businessGrowth: 12,
          reviewGrowth: 5,
          messageGrowth: 15
        };

        // Set dashboard stats
        setStats({
          totalUsers: users.length,
          totalBusinesses: businesses.length,
          totalReviews: reviews.length,
          totalMessages: messages.length,
          ...mockGrowthData
        });

        // Generate recent activity (would be populated from actual activity logs API)
        // Mock data for now
        const mockActivity: ActivityItem[] = [
          {
            id: 1,
            type: 'approval',
            action: 'Approved new business',
            user: 'Admin',
            target: 'Joe\'s Plumbing',
            time: '10 minutes ago'
          },
          {
            id: 2,
            type: 'new',
            action: 'New user registered',
            user: 'System',
            target: 'John Smith',
            time: '1 hour ago'
          },
          {
            id: 3,
            type: 'flag',
            action: 'Flagged inappropriate review',
            user: 'Admin',
            target: 'Review #1234',
            time: '3 hours ago'
          },
          {
            id: 4,
            type: 'rejection',
            action: 'Rejected business application',
            user: 'Admin',
            target: 'Fake Company Ltd',
            time: '1 day ago'
          }
        ];
        setRecentActivity(mockActivity);

      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    pendingBusinesses,
    recentActivity,
    loading,
    error,
  };
}; 