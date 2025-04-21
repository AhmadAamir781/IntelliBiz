import { useState, useEffect } from 'react';
import { businessApi, appointmentApi, reviewApi, messageApi } from '@/lib/api';
import { Business, Appointment, Review, Message } from '@/lib/types';

interface BusinessStats {
  profileViews: number;
  viewsGrowth: number;
  appointments: number;
  appointmentsGrowth: number;
  reviews: number;
  averageRating: number;
  messages: number;
  unreadMessages: number;
}

export const useBusinessDashboard = () => {
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        setError(null);
debugger
        // Get the current user from localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('User not found');
        }
        
        const user = JSON.parse(userStr);
        
        // Fetch business associated with the user
        const businessResponse = await businessApi.getBusinessesByOwner(user.id);
        const business = businessResponse.data?.[0] || null;
        debugger
        if (!business) {
          throw new Error('No business found for this user');
        }
        
        debugger
        setBusiness(business);
        // Fetch all necessary data in parallel
        const [appointmentsResponse, reviewsResponse, messagesResponse] = await Promise.all([

          appointmentApi.getBusinessAppointments(business.id),
          reviewApi.getReviewsByBusiness(business.id),
          messageApi.getBusinessMessages(business.id),
        ]);

        // Extract data
        const appointments = appointmentsResponse.data || [];
        const reviews = reviewsResponse.data || [];
        const messages = messagesResponse.data || [];
        
        // Set upcoming appointments (filter by date > today)
        const today = new Date();
        const upcoming = appointments
          .filter(app => new Date(app.appointmentDate) >= today)
          .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
          .slice(0, 4);
        
        setUpcomingAppointments(upcoming);
        
        // Set recent messages (sort by date)
        const recent = messages
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        
        setRecentMessages(recent);
        
        // Set recent reviews (sort by date)
        const recentReviews = reviews
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        
        setRecentReviews(recentReviews);
        
        // Generate stats
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        // For now using mock data for some stats that might not be directly available
        setStats({
          profileViews: business.viewCount || 1248,
          viewsGrowth: 12,
          appointments: appointments.length,
          appointmentsGrowth: 8,
          reviews: reviews.length,
          averageRating,
          messages: messages.length,
          unreadMessages: messages.filter(m => !m.isRead).length
        });

      } catch (err) {
        console.error('Error fetching business dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch business dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  return {
    stats,
    business,
    upcomingAppointments,
    recentMessages,
    recentReviews,
    loading,
    error,
  };
}; 