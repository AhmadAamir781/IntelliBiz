import { useState, useEffect, useMemo } from 'react';
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

interface PaginatedBusinessResponse {
  businesses: Business[];
  totalPages: number;
}

export const useAdminBusinesses = (filters: BusinessFilters = {}) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 🧠 Use stable filters dependency to avoid infinite loop
  const stableFilters = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await businessApi.getAllBusinesses();

        if (response?.data) {
          setBusinesses(response.data);
          setTotalPages(1); // Can be dynamic if API supports pagination later
        }

        // Uncomment when API supports stats
        // const statsResponse = await businessApi.getBusinessStats();
        // if (statsResponse?.data) {
        //   setStats(statsResponse.data);
        // }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [stableFilters]);

  const updateBusinessStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await businessApi.updateBusiness(id, { status });
      const response = await businessApi.getAllBusinesses();
      if (response?.data) {
        setBusinesses(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business status');
    }
  };

  const deleteBusiness = async (id: number) => {
    try {
      await businessApi.deleteBusiness(id);
      const response = await businessApi.getAllBusinesses();
      if (response?.data) {
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
