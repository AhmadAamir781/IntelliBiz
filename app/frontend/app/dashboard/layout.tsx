"use client"

import RouteGuard from '@/components/auth/RouteGuard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Dashboard is only accessible to authenticated users with specific roles
  return (
    <RouteGuard allowedRoles={['Admin', 'BusinessOwner', 'user']}>
      {children}
    </RouteGuard>
  )
} 