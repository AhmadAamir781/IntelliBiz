// import { useState, useEffect } from 'react';
// import { useAuthContext } from '../lib/AuthContext';
// import { businessApi } from '../lib/api';
// import { Business, ApiResponse } from '../lib/types';

// interface BusinessFilters {
//   status?: 'all' | 'approved' | 'pending' | 'rejected';
//   category?: string;
//   searchQuery?: string;
//   page?: number;
//   pageSize?: number;
// }

// interface BusinessStats {
//   total: number;
//   approved: number;
//   pending: number;
//   rejected: number;
//   categories: { name: string; count: number }[];
// }

// export const useAdminBusinesses = (filters: BusinessFilters = {}) => {
//   const { user } = useAuthContext();
//   const [businesses, setBusinesses] = useState<Business[]>([]);
//   const [stats, setStats] = useState<BusinessStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totalPages, setTotalPages] = useState(1);

//   useEffect(() => {
//     const fetchBusinesses = async () => {
//       if (!user) return;

//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch businesses with filters
//         const response = await businessApi.getAllBusinesses({
//           status: filters.status !== 'all' ? filters.status : undefined,
//           category: filters.category !== 'all' ? filters.category : undefined,
//           searchQuery: filters.searchQuery,
//           page: filters.page,
//           pageSize: filters.pageSize,
//         });

//         const data = (response.data as unknown as ApiResponse<Business[]>).data;
//         setBusinesses(data.businesses);
//         setTotalPages(data.totalPages);

//         // Fetch business stats
//         const statsResponse = await businessApi.getBusinessStats();
//         const statsData = (statsResponse.data as unknown as ApiResponse<BusinessStats>).data;
//         setStats(statsData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch businesses');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBusinesses();
//   }, [user, filters]);

//   const updateBusinessStatus = async (id: string, status: 'approved' | 'rejected') => {
//     try {
//       await businessApi.updateBusinessStatus(id, status);
//       // Refresh the businesses list
//       const response = await businessApi.getAllBusinesses({
//         status: filters.status !== 'all' ? filters.status : undefined,
//         category: filters.category !== 'all' ? filters.category : undefined,
//         searchQuery: filters.searchQuery,
//         page: filters.page,
//         pageSize: filters.pageSize,
//       });
//       const data = (response.data as unknown as ApiResponse<Business[]>).data;
//       setBusinesses(data.businesses);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to update business status');
//     }
//   };

//   const deleteBusiness = async (id: string) => {
//     try {
//       await businessApi.deleteBusiness(id);
//       // Refresh the businesses list
//       const response = await businessApi.getAllBusinesses({
//         status: filters.status !== 'all' ? filters.status : undefined,
//         category: filters.category !== 'all' ? filters.category : undefined,
//         searchQuery: filters.searchQuery,
//         page: filters.page,
//         pageSize: filters.pageSize,
//       });
//       const data = (response.data as unknown as ApiResponse<Business[]>).data;
//       setBusinesses(data.businesses);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to delete business');
//     }
//   };

//   return {
//     businesses,
//     stats,
//     loading,
//     error,
//     totalPages,
//     updateBusinessStatus,
//     deleteBusiness,
//   };
// }; 