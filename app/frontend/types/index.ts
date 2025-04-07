// Auth Types
export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface AuthResponse {
    userId: number;
    username: string;
    email: string;
    role: string;
    token: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  }
  
  export interface UserUpdate {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }
  
  export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  // Business Types
  export interface Business {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    category: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
    email: string;
    website: string;
    logoUrl: string;
    coverImageUrl: string;
    isVerified: boolean;
    isActive: boolean;
    averageRating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt?: string;
    businessHours: BusinessHour[];
    services: BusinessService[];
    images: string[];
  }
  
  export interface BusinessQueryParams {
    search?: string;
    category?: string;
    city?: string;
    state?: string;
    isVerified?: boolean;
    isActive?: boolean;
    sortBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }
  
  export interface BusinessHour {
    id?: number;
    businessId?: number;
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }
  
  export interface BusinessService {
    id: number;
    name: string;
    description?: string;
    price?: number;
    duration?: string;
    businessId: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  // Review Types
  export interface Review {
    id: number;
    businessId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
    username: string;
    firstName: string;
    lastName: string;
    businessName?: string;
  }
  
  // Appointment Types
  export interface Appointment {
    id: number;
    businessId: number;
    userId: number;
    serviceId?: number;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    notes: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
    createdAt: string;
    updatedAt?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    businessName?: string;
    businessAddress?: string;
    businessCity?: string;
    serviceName?: string;
    servicePrice?: number;
    serviceDuration?: number;
  }
  
  // Message Types
  export interface Message {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  }
  
  export interface Conversation {
    id: number;
    userId: number;
    businessId: number;
    createdAt: string;
    userUsername?: string;
    userFirstName?: string;
    userLastName?: string;
    businessName?: string;
    businessLogoUrl?: string;
    unreadCount?: number;
    lastMessage?: string;
    lastMessageDate?: string;
  }
  
  // Utility Types
  export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageCount: number;
    currentPage: number;
    pageSize: number;
  }