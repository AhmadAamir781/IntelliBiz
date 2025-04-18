"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
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
  Bell,
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
} from "@/components/ui/sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Prevent hydration errors
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close sidebar on small screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname?.startsWith(href) && href !== "/admin"
  }

  if (!isMounted) {
    return null
  }

  return (
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
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs text-muted-foreground">admin@intellibiz.com</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link href="/login">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex justify-center">
          <Logo />
          <span className="ml-2 bg-primary/10 text-primary text-sm font-medium px-2 py-0.5 rounded">Admin</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>New business registration</DropdownMenuItem>
            <DropdownMenuItem>Review flagged for moderation</DropdownMenuItem>
            <DropdownMenuItem>System update available</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <SidebarProvider defaultOpen={isSidebarOpen}>
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 flex items-center gap-1 px-2">
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">Admin User</span>
                          <span className="text-xs text-muted-foreground">admin@intellibiz.com</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/login">Sign out</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
                <Link href="/login">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Link>
              </Button>
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>

        {/* Main Content */}
        <div className="flex-1 w-full">
          <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-background px-6 md:flex">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New business registration</DropdownMenuItem>
                  <DropdownMenuItem>Review flagged for moderation</DropdownMenuItem>
                  <DropdownMenuItem>System update available</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="p-4 md:p-6 overflow-x-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
