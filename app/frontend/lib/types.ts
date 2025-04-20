export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  profilePicture?: string;
}

export interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  website?: string;
  ownerId: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  rating: number;
  status: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  businessId: number;
  isActive: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  businessId: number;
  rating: number;
  comment: string;
  isFlagged: boolean;
  flagReason?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userName?: string;
  userAvatar?: string;
  businessName?: string;
}

export interface Appointment {
  id: number;
  userId: number;
  businessId: number;
  serviceId: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  service: {
    id: number;
    name: string;
    duration: number;
  };
}

export interface Message {
  id: number;
  userId: number;
  businessId: number;
  content: string;
  isRead: boolean;
  isFromBusiness: boolean;
  senderName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Settings {
  siteName: string;
  adminEmail: string;
  supportEmail: string;
  defaultCurrency: string;
  termsOfService: string;
  privacyPolicy: string;
  updatedAt?: string;
}

export interface BusinessDetailDto {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  state: string;
  ownerName: string;
  employees: string;
  services: string[];
  hours: BusinessHoursDto;
  images: string[];
  verified: boolean;
  licenses: string;
  paymentMethods: string[];
  serviceArea?: string[];
}

export interface BusinessHoursDto {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
} 

export interface DashboardData {
  stats: {
    totalAppointments: number;
    confirmedAppointments: number;
    totalMessages: number;
    unreadMessages: number;
    totalFavorites: number;
    totalReviews: number;
    averageRating: number;
  };
  appointments: Appointment[];
  recentActivity: {
    id: string;
    businessName: string;
    action: string;
    time: string;
    type: "appointment" | "message" | "review" | "favorite";
  }[];
  favoriteBusinesses: { businessId: string }[];
}
