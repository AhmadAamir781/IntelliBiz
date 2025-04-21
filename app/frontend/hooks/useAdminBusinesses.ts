import { useState, useEffect } from 'react';
import { businessApi } from '../lib/api';
import { Business, ApiResponse } from '../lib/types';

interface BusinessFilters {
  status?: 'all' | 'approved' | 'pending' | 'rejected';
  category?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

interface BusinessStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  categories: { name: string; count: number }[];
}

// Define structure for the paginated business response
interface PaginatedBusinessResponse {
  businesses: Business[];
  totalPages: number;
}

export const useAdminBusinesses = (filters: BusinessFilters = {}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch businesses
        const response = await businessApi.getAllBusinesses();
        
        // For now, use the direct response since API doesn't support filters yet
        if (response.data) {
          setBusinesses(response.data);
          setTotalPages(1); // Default to 1 page until pagination is implemented
        }

        // Skip stats for now as it's not implemented in the API
        // When implemented, uncomment the following:
        // const statsResponse = await businessApi.getBusinessStats();
        // setStats(statsResponse.data);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [filters]);

  const updateBusinessStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      // Since updateBusinessStatus doesn't exist, use updateBusiness
      await businessApi.updateBusiness(id, { status });
      // Refresh the businesses list
      const response = await businessApi.getAllBusinesses();
      if (response.data) {
        setBusinesses(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business status');
    }
  };

  const deleteBusiness = async (id: number) => {
    try {
      await businessApi.deleteBusiness(id);
      // Refresh the businesses list
      const response = await businessApi.getAllBusinesses();
      if (response.data) {
        setBusinesses(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete business');
    }
  };

  return {
    businesses,
    stats,
    loading,
    error,
    totalPages,
    updateBusinessStatus,
    deleteBusiness,
  };
}; 