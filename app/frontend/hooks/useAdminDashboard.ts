// import { useState, useEffect } from 'react';
// import { useAuthContext } from '../lib/AuthContext';
// import { businessApi, userApi, reviewApi, messageApi } from '../lib/api';
// import { Business, User, Review, Message, ApiResponse } from '../lib/types';

// interface AdminStats {
//   totalBusinesses: number;
//   totalUsers: number;
//   totalReviews: number;
//   totalMessages: number;
//   businessGrowth: number;
//   userGrowth: number;
//   reviewGrowth: number;
//   messageGrowth: number;
// }

// interface PendingBusiness {
//   id: string;
//   name: string;
//   category: string;
//   date: string;
//   status: 'pending' | 'approved' | 'rejected';
// }

// interface AdminActivity {
//   id: string;
//   type: 'approval' | 'flag' | 'rejection' | 'update';
//   user: string;
//   action: string;
//   target: string;
//   time: string;
// }

// export const useAdminDashboard = () => {
//   const { user } = useAuthContext();
//   const [stats, setStats] = useState<AdminStats | null>(null);
//   const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([]);
//   const [recentActivity, setRecentActivity] = useState<AdminActivity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       if (!user) return;

//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all data in parallel
//         const [businessesResponse, usersResponse, reviewsResponse, messagesResponse] = await Promise.all([
//           businessApi.getAllBusinesses(),
//           userApi.getAllUsers(),
//           reviewApi.getAllReviews(),
//           messageApi.getAllMessages(),
//         ]);

//         // Process the data
//         const businesses = (businessesResponse.data as unknown as ApiResponse<Business[]>).data;
//         const users = (usersResponse.data as unknown as ApiResponse<User[]>).data;
//         const reviews = (reviewsResponse.data as unknown as ApiResponse<Review[]>).data;
//         const messages = (messagesResponse.data as unknown as ApiResponse<Message[]>).data;

//         // Calculate stats
//         const stats: AdminStats = {
//           totalBusinesses: businesses.length,
//           totalUsers: users.length,
//           totalReviews: reviews.length,
//           totalMessages: messages.length,
//           businessGrowth: 12, // This should be calculated from historical data
//           userGrowth: 8, // This should be calculated from historical data
//           reviewGrowth: 24, // This should be calculated from historical data
//           messageGrowth: 18, // This should be calculated from historical data
//         };

//         // Get pending businesses
//         const pendingBusinesses: PendingBusiness[] = businesses
//           .filter((b: Business) => b.status === 'pending')
//           .map((b: Business) => ({
//             id: b.id.toString(),
//             name: b.name,
//             category: b.category,
//             date: b.createdAt,
//             status: b.status,
//           }))
//           .slice(0, 4);

//         // Create recent activity (this should come from an activity log API)
//         const recentActivity: AdminActivity[] = [
//           {
//             id: '1',
//             type: 'approval',
//             user: 'Admin',
//             action: 'Approved business registration',
//             target: 'City Plumbers Inc.',
//             time: '10 minutes ago',
//           },
//           {
//             id: '2',
//             type: 'flag',
//             user: 'Moderator',
//             action: 'Flagged review for moderation',
//             target: 'Elite Electrical Services',
//             time: '45 minutes ago',
//           },
//           {
//             id: '3',
//             type: 'rejection',
//             user: 'Admin',
//             action: 'Rejected business registration',
//             target: 'Fake Business LLC',
//             time: '2 hours ago',
//           },
//           {
//             id: '4',
//             type: 'update',
//             user: 'System',
//             action: 'Updated category listings',
//             target: 'All businesses',
//             time: '5 hours ago',
//           },
//         ];

//         setStats(stats);
//         setPendingBusinesses(pendingBusinesses);
//         setRecentActivity(recentActivity);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch admin dashboard data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, [user]);

//   return { stats, pendingBusinesses, recentActivity, loading, error };
// }; 