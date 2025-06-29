import axios, { AxiosError, AxiosResponse } from "axios"
import {
  User,
  Business,
  Service,
  Review,
  Appointment,
  Message,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  Settings,
  GoogleLoginRequest
} from "./types"
import { googleOAuth } from "./oauth"
import { facebookOAuth } from "./oauth"

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: "http://localhost:5075/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Function to check if token exists and is valid
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("token")
  return !!token // Returns true if token exists
}

// Function to get current user data from localStorage
export const getCurrentUser = (): User | null => {
  const userString = localStorage.getItem("user")
  if (!userString) return null
  try {
    return JSON.parse(userString)
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

// Function to get user role
export const getUserRole = (): string | null => {
  const user = getCurrentUser()
  return user?.role || null
}

// Role-based route protection
export const hasAccess = (allowedRoles: string[]): boolean => {
  const userRole = getUserRole()
  return userRole ? allowedRoles.includes(userRole) : false
}

// Function to handle unauthorized access (redirect to previous page)
export const handleUnauthorizedAccess = (): void => {
  if (typeof window !== 'undefined') {
    if (window.history.length > 1) {
      window.history.back() // Go back to previous page if available
    } else {
      window.location.href = "/" // Otherwise go to home
    }
  }
}

// Function to redirect to login page
export const redirectToLogin = (): void => {
  if (typeof window !== 'undefined') {
    // Store the current path so we can redirect back after login
    const currentPath = window.location.pathname
    if (currentPath !== '/login') {
      localStorage.setItem("redirectAfterLogin", currentPath)
      window.location.href = "/login"
    }
  }
}

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      redirectToLogin()
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have the right permissions
      console.error("Access forbidden:", error.response?.data)
      handleUnauthorizedAccess() // Redirect to previous page
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post("/auth/login", data)
     
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      // If user is admin, always redirect to admin dashboard
      if (response.data.user?.role === 'Admin') {
        window.location.href = "/admin"
        return response as unknown as ApiResponse<any>
      }
      
      // For non-admin users, handle redirect after login if there's a saved path
      const redirectPath = localStorage.getItem("redirectAfterLogin")
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin")
        window.location.href = redirectPath
      }
    }
    return response as unknown as ApiResponse<any>
  },

  register: (data: RegisterRequest): Promise<ApiResponse<any>> =>
    api.post("/auth/register", data),
    
  logout: (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  },
  
  refreshUserData: async (): Promise<void> => {
    try {
      const user = getCurrentUser()
      if (user && user.id) {
        const response = await userApi.getProfile(user.id)
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data))
        }
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error)
    }
  },

  // OAuth methods
  googleLogin: async (idToken: string): Promise<ApiResponse<any>> => {
    const userInfo = await googleOAuth.getUserInfo(idToken)
    const googleLoginRequest: GoogleLoginRequest = {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
    
    const response = await api.post("/auth/google",  googleLoginRequest )
    
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      // Handle redirect based on user role
      const redirectPath = localStorage.getItem("redirectAfterLogin")
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin")
        window.location.href = redirectPath
      } else {
        const userRole = response.data.user?.role
        if (userRole === 'Admin') {
          window.location.href = "/admin"
        } else if (userRole === 'BusinessOwner') {
          window.location.href = "/business"
        } else {
          window.location.href = "/dashboard"
        }
      }
    }
    return response as unknown as ApiResponse<any>
  },

  facebookLogin: async (token: string): Promise<ApiResponse<any>> => {

    const response = await api.post("/auth/facebook", {AccessToken: token})
    
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      
      // Handle redirect based on user role
      const redirectPath = localStorage.getItem("redirectAfterLogin")
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin")
        window.location.href = redirectPath
      } else {
        const userRole = response.data.user?.role
        if (userRole === 'Admin') {
          window.location.href = "/admin"
        } else if (userRole === 'BusinessOwner') {
          window.location.href = "/business"
        } else {
          window.location.href = "/dashboard"
        }
      }
    }
    return response as unknown as ApiResponse<any>
  },
}

// User API
export const userApi = {
  getProfile: (userId: number): Promise<ApiResponse<User>> =>
    api.get(`/users/${userId}`),

  updateProfile: (userId: number, userData: Partial<User>): Promise<ApiResponse<User>> =>
    api.put(`/users/${userId}`, userData),

  getAllUsers: (): Promise<ApiResponse<User[]>> =>
    api.get("/users"),

  getUsersByRole: (role: string): Promise<ApiResponse<User[]>> =>
    api.get(`/users/role/${role}`),

  getUsersByEmail: (email: string): Promise<ApiResponse<User>> =>
    api.get(`/users/email/${email}`),

  deleteUser: (userId: number): Promise<ApiResponse<void>> =>
    api.delete(`/users/${userId}`),
}

// Business API
export const businessApi = {
  getAllBusinesses: (): Promise<ApiResponse<Business[]>> =>
    api.get("/businesses"),
getAllCategories:(): Promise<ApiResponse<string[]>> =>
  api.get("/businesses/categories"),
  getBusinessById: (businessId: number): Promise<ApiResponse<Business>> =>
    api.get(`/businesses/${businessId}`),

  getBusinessesByOwner: (ownerId: number): Promise<ApiResponse<any>> =>
    api.get(`/businesses/owner/${ownerId}`),

  getBusinessesByCategory: (category: string): Promise<ApiResponse<Business[]>> =>
    api.get(`/businesses/category/${category}`),

  searchBusinesses: (term: string, category?: string): Promise<ApiResponse<Business[]>> =>
    api.get("/businesses/search", {
      params: { term, ...(category && { category }) },
    }),

  createBusiness: (businessData : any) => api.post("/businesses", businessData),

  updateBusiness: (businessId: number, businessData: Partial<Business>): Promise<ApiResponse<Business>> =>
    api.put(`/businesses/${businessId}`, businessData),

  deleteBusiness: (businessId: number): Promise<ApiResponse<void>> =>
    api.delete(`/businesses/${businessId}`),

  verifyBusiness: (businessId: number): Promise<ApiResponse<Business>> =>
    api.patch(`/businesses/${businessId}/verify`),

  getBusinessAnalytics: async (businessId: number, timeRange: string): Promise<ApiResponse<{
    overview: {
      profileViews: { total: number; change: number; positive: boolean };
      appointments: { total: number; change: number; positive: boolean };
      reviews: { total: number; change: number; positive: boolean };
      messages: { total: number; change: number; positive: boolean };
    };
    topServices: Array<{
      name: string;
      views: number;
      bookings: number;
      revenue: string;
      growth: number;
      positive: boolean;
    }>;
    demographics: {
      age: Array<{ group: string; percentage: number }>;
      gender: Array<{ group: string; percentage: number }>;
      location: Array<{ area: string; percentage: number }>;
    };
    sources: Array<{ source: string; percentage: number }>;
  }>> => {
    return api.get(`/businesses/analytics/${businessId}?timeRange=${timeRange}`);
  },
  getBusinessDetail: async (businessId: number): Promise<ApiResponse<any>> => {
    return api.get(`/businesses/${businessId}`);
  },
}

// Service API
export const serviceApi = {
  getAllServices: (): Promise<ApiResponse<Service[]>> =>
    api.get("/services"),

  getServiceById: (serviceId: number): Promise<ApiResponse<Service>> =>
    api.get(`/services/${serviceId}`),

  getServicesByBusiness: (businessId: number): Promise<ApiResponse<Service[]>> =>
    api.get(`/services/business/${businessId}`),

  createService: (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> =>
    api.post("/services", serviceData),

  updateService: (serviceId: number, serviceData: Partial<Service>): Promise<ApiResponse<Service>> =>
    api.put(`/services/${serviceId}`, serviceData),

  deleteService: (serviceId: number): Promise<ApiResponse<void>> =>
    api.delete(`/services/${serviceId}`),

  toggleServiceActive: (serviceId: number): Promise<ApiResponse<Service>> =>
    api.patch(`/services/${serviceId}/toggle-active`),
}

// Review API
export const reviewApi = {
  getAllReviews: (): Promise<ApiResponse<Review[]>> =>
    api.get("/reviews"),

  getReviewById: (reviewId: number): Promise<ApiResponse<Review>> =>
    api.get(`/reviews/${reviewId}`),

  getReviewsByBusiness: (businessId: number): Promise<ApiResponse<Review[]>> =>
    api.get(`/reviews/business/${businessId}`),

  getReviewsByUser: (userId: number): Promise<ApiResponse<any>> =>
    api.get(`/reviews/user/${userId}`),

  getPendingReviews: (): Promise<ApiResponse<Review[]>> =>
    api.get("/reviews/pending"),

  getPublishedReviews: (): Promise<ApiResponse<Review[]>> =>
    api.get("/reviews/published"),

  getFlaggedReviews: (): Promise<ApiResponse<Review[]>> =>
    api.get("/reviews/flagged"),

  createReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Review>> =>
    api.post("/reviews", reviewData),

  updateReview: (reviewId: number, reviewData: Partial<Review>): Promise<ApiResponse<Review>> =>
    api.put(`/reviews/${reviewId}`, reviewData),

  deleteReview: (reviewId: number): Promise<ApiResponse<void>> =>
    api.delete(`/reviews/${reviewId}`),

  approveReview: (reviewId: number): Promise<ApiResponse<Review>> =>
    api.patch(`/reviews/${reviewId}/approve`),

  rejectReview: (reviewId: number): Promise<ApiResponse<Review>> =>
    api.patch(`/reviews/${reviewId}/reject`),

  flagReview: (reviewId: number): Promise<ApiResponse<Review>> =>
    api.patch(`/reviews/${reviewId}/flag`),

  unflagReview: (reviewId: number): Promise<ApiResponse<Review>> =>
    api.patch(`/reviews/${reviewId}/unflag`),
}

// Appointment API
export const appointmentApi = {
  getAllAppointments: (): Promise<ApiResponse<Appointment[]>> =>
    api.get("/appointments"),

  getAppointmentById: (appointmentId: number): Promise<ApiResponse<Appointment>> =>
    api.get(`/appointments/${appointmentId}`),

  getUserAppointments: (): Promise<ApiResponse<any>> =>
    api.get("/appointments/user"),

  getBusinessAppointments: (businessId: number): Promise<ApiResponse<Appointment[]>> =>
    api.get(`/appointments/business/${businessId}`),

  createAppointment: (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Appointment>> =>
    api.post("/appointments", appointmentData),

  updateAppointment: (appointmentId: number, appointmentData: Partial<Appointment>): Promise<ApiResponse<Appointment>> =>
    api.put(`/appointments/${appointmentId}`, appointmentData),

  deleteAppointment: (appointmentId: number): Promise<ApiResponse<void>> =>
    api.delete(`/appointments/${appointmentId}`),

  updateAppointmentStatus: (appointmentId: number, status: Appointment['status']): Promise<ApiResponse<Appointment>> =>
    api.patch(`/appointments/${appointmentId}/status`, { status }),
}

// Message API
export const messageApi = {
  getAllMessages: (): Promise<ApiResponse<Message[]>> =>
    api.get("/messages"),

  getMessageById: (messageId: number): Promise<ApiResponse<Message>> =>
    api.get(`/messages/${messageId}`),

  getUserMessages: (): Promise<ApiResponse<any>> =>
    api.get("/messages/user"),

  getBusinessMessages: (businessId: number): Promise<ApiResponse<Message[]>> =>
    api.get(`/messages/business/${businessId}`),

  getConversation: (userId: number, businessId: number): Promise<ApiResponse<Message[]>> =>
    api.get(`/messages/conversation?userId=${userId}&businessId=${businessId}`),

  createMessage: (messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Message>> =>
    api.post("/messages", messageData),

  sendMessage: (messageData: { businessId: number; userId: number; content: string; isFromBusiness: boolean }): Promise<ApiResponse<Message>> =>
    api.post("/messages", messageData),

  markAsRead: (messageId: number): Promise<ApiResponse<Message>> =>
    api.patch(`/messages/${messageId}/read`),

  deleteMessage: (messageId: number): Promise<ApiResponse<void>> =>
    api.delete(`/messages/${messageId}`),
}

// Settings API
export const settingsApi = {
  getSettings: (): Promise<ApiResponse<Settings>> =>
    api.get("/settings"),

  updateSettings: (settings: Settings): Promise<ApiResponse<Settings>> =>
    api.put("/settings", settings),
}

export default api
