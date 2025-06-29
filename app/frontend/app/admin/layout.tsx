"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  Store,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, loading: authLoading, logout, hasRole, user } = useAuth()

  // Check authentication and admin role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', '/admin')
        router.push('/login')
        return
      }
      
      // Check if user has admin role
      if (isAuthenticated && !hasRole('Admin')) {
        toast.error('Access denied. Admin privileges required.')
        router.push('/')
      }
    }
  }, [isAuthenticated, authLoading, router, hasRole])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      id: "users",
      name: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      id: "businesses",
      name: "Business Management",
      href: "/admin/businesses",
      icon: Store,
    },
    {
      id: "analytics",
      name: "Reports & Analytics",
      href: "/admin/analytics",
      icon: BarChart2,
    },
    {
      id: "reviews",
      name: "Reviews & Feedback",
      href: "/admin/reviews",
      icon: MessageSquare,
    },
    {
      id: "settings",
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const getInitials = () => {
    if (!user) return 'A'
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render content if not authenticated or not an admin
  if (!isAuthenticated || (isAuthenticated && !hasRole('Admin'))) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/30">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[80%] max-w-[300px]">
              <div className="flex h-full flex-col">
                <div className="p-4 border-b">
                  <Logo />
                  <div className="mt-3 px-2 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                    Admin Panel
                  </div>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <nav className="grid gap-1 px-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                          isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="border-t p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={user?.profilePicture || "/placeholder.svg?height=32&width=32"} alt={user?.firstName || "Admin"} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Admin User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'admin@intellibiz.com'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Logo />
            <div className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">Admin Panel</div>
          </div>
        </header>

        <div className="flex">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden border-r bg-background md:flex">
            <SidebarHeader className="p-4">
              <div className="flex flex-col space-y-2">
                <Logo />
                <div className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">Admin Panel</div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <div className="flex items-center gap-2 mb-6">
                <Avatar>
                  <AvatarImage src={user?.profilePicture || "/placeholder.svg?height=32&width=32"} alt={user?.firstName || "Admin"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 flex items-center gap-1 px-2">
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Admin User'}</span>
                          <span className="text-xs text-muted-foreground">{user?.email || 'admin@intellibiz.com'}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/admin/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content */}
          <div className="flex-1 w-full">
            {/* Desktop Header */}
            <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 md:hidden">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <Logo />
                <div className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">Admin Panel</div>
              </div>
            </div>
            <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4 hidden md:flex">
              <SidebarTrigger />
            </div>
            <main className="p-4 md:p-6 overflow-x-auto">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
