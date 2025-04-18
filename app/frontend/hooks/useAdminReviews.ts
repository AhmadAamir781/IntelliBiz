import { useState, useEffect } from 'react';
import { useAuthContext } from '../lib/AuthContext';
import { reviewApi } from '../lib/api';
import { Review, ApiResponse } from '../lib/types';

interface ReviewFilters {
  status?: 'all' | 'published' | 'pending' | 'flagged';
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

interface ReviewStats {
  total: number;
  published: number;
  pending: number;
  flagged: number;
  averageRating: number;
}

export const useAdminReviews = (filters: ReviewFilters = {}) => {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch reviews based on status
        let response;
        if (filters.status === 'pending') {
          response = await reviewApi.getPendingReviews();
        } else if (filters.status === 'flagged') {
          response = await reviewApi.getFlaggedReviews();
        } else {
          response = await reviewApi.getAllReviews();
        }

        const data = (response.data as unknown as ApiResponse<Review[]>).data;
        setReviews(data);

        // Calculate stats from the reviews
        const reviewStats: ReviewStats = {
          total: data.length,
          published: data.filter(r => r.status === 'approved').length,
          pending: data.filter(r => r.status === 'pending').length,
          flagged: data.filter(r => r.isFlagged).length,
          averageRating: data.reduce((acc, r) => acc + r.rating, 0) / data.length || 0,
        };
        setStats(reviewStats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user, filters.status]);

  const approveReview = async (id: number) => {
    try {
      await reviewApi.approveReview(id);
      // Refresh the reviews list
      const response = await reviewApi.getAllReviews();
      const data = (response.data as unknown as ApiResponse<Review[]>).data;
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve review');
    }
  };

  const rejectReview = async (id: number) => {
    try {
      await reviewApi.rejectReview(id);
      // Refresh the reviews list
      const response = await reviewApi.getAllReviews();
      const data = (response.data as unknown as ApiResponse<Review[]>).data;
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject review');
    }
  };

  const deleteReview = async (id: number) => {
    try {
      await reviewApi.deleteReview(id);
      // Refresh the reviews list
      const response = await reviewApi.getAllReviews();
      const data = (response.data as unknown as ApiResponse<Review[]>).data;
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  const unflagReview = async (id: number) => {
    try {
      await reviewApi.unflagReview(id);
      // Refresh the reviews list
      const response = await reviewApi.getAllReviews();
      const data = (response.data as unknown as ApiResponse<Review[]>).data;
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unflag review');
    }
  };

  return {
    reviews,
    stats,
    loading,
    error,
    totalPages,
    approveReview,
    rejectReview,
    deleteReview,
    unflagReview,
  };
}; 