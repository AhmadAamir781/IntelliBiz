import { useState, useEffect } from 'react';
import { reviewApi } from '../lib/api';
import { Review } from '../lib/types';
import { toast } from 'sonner';

interface AdminReviewsFilters {
  status: 'all' | 'published' | 'pending' | 'flagged' | 'rejected';
  page: number;
  pageSize: number;
}

interface ReviewStats {
  total: number;
  published: number;
  pending: number;
  flagged: number;
  rejected: number;
}

export const useAdminReviews = (filters: AdminReviewsFilters) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    published: 0,
    pending: 0,
    flagged: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      let reviewsData: Review[] = [];

      // Fetch all reviews first
      const allReviewsResponse = await reviewApi.getAllReviews();
      if (allReviewsResponse.data) {
        reviewsData = allReviewsResponse.data;
      }

      // Filter reviews based on status
      let filteredReviews = reviewsData;
      if (filters.status !== 'all') {
        switch (filters.status) {
          case 'published':
            filteredReviews = reviewsData.filter(review => review.status === 'published');
            break;
          case 'rejected':
            filteredReviews = reviewsData.filter(review => review.status === 'rejected');
            break;
          case 'flagged':
            filteredReviews = reviewsData.filter(review => review.isFlagged);
            break;
        }
      }

      // Calculate stats
      const statsData: ReviewStats = {
        total: reviewsData.length,
        published: reviewsData.filter(r => r.status === 'published').length,
        pending: reviewsData.filter(r => r.status === 'pending').length,
        flagged: reviewsData.filter(r => r.isFlagged).length,
        rejected: reviewsData.filter(r => r.status === 'rejected').length
      };

      // Paginate results
      const startIndex = (filters.page - 1) * filters.pageSize;
      const endIndex = startIndex + filters.pageSize;
      const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

      setReviews(paginatedReviews);
      setStats(statsData);
      setTotalPages(Math.ceil(filteredReviews.length / filters.pageSize));

    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews when filters change
  useEffect(() => {
    fetchReviews();
  }, [filters.status, filters.page, filters.pageSize]);

  const approveReview = async (reviewId: number) => {
    try {
      const response = await reviewApi.approveReview(reviewId);
      if (response.data) {
        toast.success('Review approved successfully');
        fetchReviews(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving review:', error);
      toast.error('Failed to approve review');
    }
  };

  const rejectReview = async (reviewId: number) => {
    try {
      const response = await reviewApi.rejectReview(reviewId);
      if (response.data) {
        toast.success('Review rejected successfully');
        fetchReviews(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast.error('Failed to reject review');
    }
  };

  const deleteReview = async (reviewId: number) => {
    try {
      await reviewApi.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const unflagReview = async (reviewId: number) => {
    try {
      const response = await reviewApi.unflagReview(reviewId);
      if (response.data) {
        toast.success('Review unflagged successfully');
        fetchReviews(); // Refresh the list
      }
    } catch (error) {
      console.error('Error unflagging review:', error);
      toast.error('Failed to unflag review');
    }
  };

  const flagReview = async (reviewId: number) => {
    try {
      const response = await reviewApi.flagReview(reviewId);
      if (response.data) {
        toast.success('Review flagged successfully');
        fetchReviews(); // Refresh the list
      }
    } catch (error) {
      console.error('Error flagging review:', error);
      toast.error('Failed to flag review');
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
    flagReview,
    refresh: fetchReviews
  };
}; 