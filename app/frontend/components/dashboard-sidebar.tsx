"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, MessageSquare, Heart, Star, Settings, HelpCircle, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
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

interface DashboardSidebarProps {
  activeItem?: string
}

export function DashboardSidebar({ activeItem = "dashboard" }: DashboardSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "appointments",
      name: "Appointments",
      href: "/dashboard/appointments",
      icon: Calendar,
    },
    {
      id: "messages",
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    {
      id: "favorites",
      name: "Favorites",
      href: "/dashboard/favorites",
      icon: Heart,
    },
    {
      id: "reviews",
      name: "Reviews",
      href: "/dashboard/reviews",
      icon: Star,
    },
    {
      id: "settings",
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  const isActive = (id: string) => {
    return id === activeItem || pathname === menuItems.find((item) => item.id === id)?.href
  }

  const MobileSidebar = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-full flex-col">
          <div className="p-4 border-b">
            <Logo />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                    isActive(item.id) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <nav className="grid gap-1">
              <Link href="/help" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Link>
              <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                <LogOut className="h-4 w-4" />
                Sign out
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <MobileSidebar />

      <SidebarProvider defaultOpen={true}>
        <Sidebar className="hidden border-r bg-background md:flex">
          <SidebarHeader className="p-4">
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild isActive={isActive(item.id)}>
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
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/help">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/login">
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </>
  )
}

