"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { Logo } from "@/components/logo"
import { authApi, userApi, getUserRole } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { googleOAuth, facebookOAuth } from "@/lib/oauth"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const { showSuccessToast, showErrorToast } = useToast()
  const [error, setError] = useState("")

  // Initialize OAuth providers
  useEffect(() => {
    googleOAuth.init()
    facebookOAuth.init()
  }, [])

  // Check if user is already logged in and redirect based on role
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
       
      try {
        // Get user from localStorage for initial data
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          
          try {
            // Also verify with backend to get the most up-to-date role
            const userResponse = await userApi.getUsersByEmail(user.email)
            const verifiedUser = userResponse.data
            
            // Use the verified role if it exists, otherwise fallback to stored role
            const role = verifiedUser?.role || user.role
             
            // Redirect based on user role
            if (role === "Admin") {
              router.push("/admin")
            } else if (role === "BusinessOwner") {
              router.push("/business")
            } else {
              router.push("/businesses")
            }
          } catch (apiError) {
            // If API fails, still use stored user data
            console.error("Error verifying user with API:", apiError)
            
            // Redirect based on stored user role
            if (user.role === "Admin") {
              router.push("/login")
            } else if (user.role === "BusinessOwner") {
              router.push("/login") 
            } else {
              router.push("/login")
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Clear potentially corrupted data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    
    checkAuthStatus()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }))
  }

  // OAuth handlers
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      const accessToken = await googleOAuth.signIn()
      const response = await authApi.googleLogin(accessToken)
      
      if (response.data?.token) {
        showSuccessToast("Login successful", "Welcome back!")
      } else {
        setError("Google login failed")
        showErrorToast("Login failed", "Google login failed")
      }
    } catch (error: any) {
      console.error("Google login error:", error)
      const errorMessage = error.message || "An error occurred during Google login"
      setError(errorMessage)
      showErrorToast("Google login failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      console.log("Starting Facebook login...")

      console.log("Getting Facebook access token...")
      const accessToken = await facebookOAuth.signIn()

      debugger
      console.log("Facebook access token received:", accessToken ? "Success" : "Failed")
      
      console.log("Getting Facebook user info...")
      const facebookResponse = await authApi.facebookLogin(accessToken)
      console.log("Facebook API response:", facebookResponse)
      
      if (facebookResponse.data?.token) {
        showSuccessToast("Login successful", "Welcome back!")
      } else {
        setError("Facebook login failed")
        showErrorToast("Login failed", "Facebook login failed. Please try again.")
      }
    } catch (error: any) {
      console.error('Facebook login error:', error)
      const errorMessage = error.message || "An error occurred during Facebook login"
      setError(errorMessage)
      showErrorToast("Facebook login failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Development helper for testing Facebook login
  const handleFacebookLoginDev = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      console.log("Starting Facebook login (Development Mode)...")
      
      // Mock Facebook login for development
      const mockUserInfo = {
        id: "dev_facebook_user_123",
        name: "Development User",
        email: "dev@example.com",
        picture: "https://via.placeholder.com/150"
      }
      
      const mockRequest = {
        email: mockUserInfo.email,
        name: mockUserInfo.name,
        picture: mockUserInfo.picture,
      }
      
      console.log("Sending mock Facebook login request...")
      const response = await authApi.facebookLogin("mock_token")
      console.log("Mock Facebook API response:", response)
      
      if (response.data?.token) {
        showSuccessToast("Development Login successful", "Welcome back!")
      } else {
        setError("Development Facebook login failed")
        showErrorToast("Login failed", "Development Facebook login failed. Please try again.")
      }
    } catch (error: any) {
      console.error('Development Facebook login error:', error)
      const errorMessage = error.message || "An error occurred during development Facebook login"
      setError(errorMessage)
      showErrorToast("Development Facebook login failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authApi.login({ email: formData.email, password: formData.password })
      
      if (response.data?.token) {
        showSuccessToast("Login successful", "Welcome back!")
        
        // Get the redirect path or determine based on role
        const redirectPath = localStorage.getItem("redirectAfterLogin")
        
        if (redirectPath) {
          // Use saved redirect path if available
          localStorage.removeItem("redirectAfterLogin")
          router.push(redirectPath)
        } else {
          // Redirect based on user role
          const userRole = getUserRole()
          
          switch(userRole) {
            case 'Admin':
              router.push('/admin/dashboard')
              break
            case 'BusinessOwner':
              router.push('/business/dashboard')
              break
            default:
              router.push('/dashboard') // Regular user
          }
        }
      } else {
        setError("Invalid login credentials")
        showErrorToast("Login failed", "Invalid login credentials")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || "An error occurred during login"
      setError(errorMessage)
      showErrorToast("Login failed", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            onLoad={() => {
              console.log("Form loaded");
              // Try using both custom toast hook and direct toast
              showErrorToast("Form Loaded", "Direct test from form onLoad");
              
              // Also attempt to call the imported toast function directly
              try {
                const { toast } = require("@/components/ui/use-toast");
                toast({
                  title: "Direct Toast Test",
                  description: "Using direct toast import",
                  variant: "destructive",
                });
              } catch (err) {
                console.error("Error calling direct toast:", err);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={formData.rememberMe} onCheckedChange={handleCheckboxChange} />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path
                          fill="#4285F4"
                          d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                        />
                        <path
                          fill="#34A853"
                          d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                        />
                      </g>
                    </svg>
                    Google
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleFacebookLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        fill="currentColor"
                      />
                    </svg>
                    Facebook
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden md:block md:w-1/2 bg-primary-gradient">
        <div className="flex flex-col justify-center items-center h-full text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Connect with Local Businesses</h1>
            <p className="text-lg mb-8">
              Find and connect with trusted local service providers in your area. From plumbers to barbers, IntelliBiz
              helps you discover the services you need.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm">Local Businesses</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">50k+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm">Service Categories</div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-primary"></div>
                  ))}
                </div>
                <div className="ml-2 text-sm">Join our growing community</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
