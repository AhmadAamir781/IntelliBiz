"use client"

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, getUserRole, hasAccess } from '@/lib/api'

type RouteGuardProps = {
  children: ReactNode
  allowedRoles?: string[] // Specific roles allowed to access this route
  requireAuth?: boolean // Whether authentication is required (default: true)
}

export default function RouteGuard({ 
  children, 
  allowedRoles = [], // Empty array means all authenticated users can access
  requireAuth = true // By default, authentication is required
}: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Check if the route requires authentication
    const checkAuth = () => {
      // Public routes that don't require authentication
      const publicPaths = ['/login', '/register', '/', '/about']
      const isPublicPath = publicPaths.includes(pathname)

      if (!requireAuth && isPublicPath) {
        setAuthorized(true)
        return
      }

      // Check if user is authenticated
      if (!isAuthenticated()) {
        setAuthorized(false)
        // Remember the current location for redirect after login
        localStorage.setItem('redirectAfterLogin', pathname)
        router.push('/login')
        return
      }

      // If roles are specified, check if user has access
      if (allowedRoles.length > 0 && !hasAccess(allowedRoles)) {
        setAuthorized(false)
        router.back() // Go back to previous page
        return
      }

      // User is authorized
      setAuthorized(true)
    }

    // Run auth check
    checkAuth()

    // Set up route change event handler
    const handleRouteChange = () => {
      checkAuth()
    }

    // Clean up the event listener
    return () => {
      // No cleanup needed for Next.js App Router
    }
  }, [pathname, router, allowedRoles, requireAuth])

  // Show loading or nothing while checking auth
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If authorized, render children
  return <>{children}</>
} 