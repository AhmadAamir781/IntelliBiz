"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getCurrentUser, getUserRole, hasAccess, authApi } from '@/lib/api'
import { User } from '@/lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load user data on component mount
    const checkAuthStatus = () => {
      try {
        if (isAuthenticated()) {
          const userData = getCurrentUser()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth status check failed:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Refresh user data from the server
  const refreshUser = async () => {
    try {
      setLoading(true)
      await authApi.refreshUserData()
      const userData = getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Failed to refresh user data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Log out current user
  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  // Redirect to login
  const redirectToLogin = (returnUrl?: string) => {
    if (returnUrl) {
      localStorage.setItem('redirectAfterLogin', returnUrl)
    }
    router.push('/login')
  }

  // Check if user has a specific role
  const hasRole = (role: string) => {
    const userRole = getUserRole()
    return userRole === role
  }

  // Check if user has permission to access content
  const checkAccess = (allowedRoles: string[]) => {
    return hasAccess(allowedRoles)
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    role: user?.role || null,
    hasRole,
    checkAccess,
    refreshUser,
    logout,
    redirectToLogin
  }
} 