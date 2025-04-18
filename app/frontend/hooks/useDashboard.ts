// hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { appointmentApi, messageApi, businessApi, reviewApi } from '../lib/api';
import { Appointment, Message, Business, Review } from '../lib/types';

// Define the structure for the data returned from the hook
interface RecentActivityItem {
  id: string;
  businessName: string;
  action: string;
  time: string;
  type: 'appointment' | 'message' | 'review' | 'favorite';
}

interface Stats {
  totalAppointments: number;
  confirmedAppointments: number;
  totalMessages: number;
  unreadMessages: number;
  totalFavorites: number;
  totalReviews: number;
  averageRating: number;
}

interface DashboardData {
  appointments: Appointment[];
  messages: Message[];
  favoriteBusinesses: Business[];
  recentActivity: RecentActivityItem[];
  stats: Stats;
}

export const useDashboard = (): {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
} => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [appointmentsResponse, messagesResponse, reviewsResponse] = await Promise.all([
          appointmentApi.getAllAppointments(),
          messageApi.getAllMessages(),
          reviewApi.getAllReviews(),
        ]);

        const favoriteBusinessesResponse = await businessApi.getAllBusinesses();

        const appointments = appointmentsResponse.data as Appointment[];
        const messages = messagesResponse.data as Message[];
        const reviews = reviewsResponse.data as Review[];
        const favoriteBusinesses = favoriteBusinessesResponse.data as Business[];

        const stats: Stats = {
          totalAppointments: appointments.length,
          confirmedAppointments: appointments.filter((a) => a.status === 'confirmed').length,
          totalMessages: messages.length,
          unreadMessages: messages.filter((m) => !m.isRead).length,
          totalFavorites: favoriteBusinesses.length,
          totalReviews: reviews.length,
          averageRating:
            reviews.length > 0
              ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
              : 0,
        };

        const recentActivity: RecentActivityItem[] = [
          ...(appointments.slice(0, 2).map((appointment) => ({
            id: appointment.id?.toString() ?? 'unknown',
            type: 'appointment' as const,
            businessName: appointment.businessId?.toString() ?? 'N/A',
            action: `Appointment ${appointment.status ?? 'unknown'}`,
            time: appointment.createdAt
              ? new Date(appointment.createdAt).toISOString()
              : '',
          }))),
          ...(messages.slice(0, 2).map((message) => ({
            id: message.id?.toString() ?? 'unknown',
            type: 'message' as const,
            businessName: message.userId?.toString() ?? 'N/A',
            action: 'New message received',
            time: message.createdAt
              ? new Date(message.createdAt).toISOString()
              : '',
          }))),
          ...(reviews.slice(0, 2).map((review) => ({
            id: review.id?.toString() ?? 'unknown',
            type: 'review' as const,
            businessName: review.businessId?.toString() ?? 'N/A',
            action: 'You left a review',
            time: review.createdAt
              ? new Date(review.createdAt).toISOString()
              : '',
          }))),
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setData({
          appointments,
          messages,
          favoriteBusinesses,
          recentActivity,
          stats,
        });
      } catch (err: any) {
        console.error('Dashboard error:', err);
        setError(err?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};
