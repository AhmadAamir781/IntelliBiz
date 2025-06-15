"use client"

import { CardFooter } from "@/components/ui/card"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, LogOut, Save } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"
import { Settings } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout, hasRole } = useAuth()
  const { settings, loading, error, updateSettings } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<Settings>({
    siteName: "",
    adminEmail: "",
    supportEmail: "",
    defaultCurrency: "",
    termsOfService: "",
    privacyPolicy: "",
  });

  // Check authentication and admin role
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', '/admin/settings')
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

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateSettings(formData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsSubmitting(false);
        }, 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Admin settings update failed:", error);
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading || (loading && !error)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render content if not authenticated or not an admin
  if (!isAuthenticated || (isAuthenticated && !hasRole('Admin'))) {
    return null;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">Manage platform settings and configurations.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Logout
        </Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure general settings for the IntelliBiz platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-2">Settings Updated!</h3>
                <p className="text-center text-muted-foreground">Admin settings have been successfully updated.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    placeholder="e.g., IntelliBiz"
                    value={formData.siteName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      placeholder="e.g., admin@intellibiz.com"
                      value={formData.adminEmail}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      name="supportEmail"
                      type="email"
                      placeholder="e.g., support@intellibiz.com"
                      value={formData.supportEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Input
                    id="defaultCurrency"
                    name="defaultCurrency"
                    placeholder="e.g., USD"
                    value={formData.defaultCurrency}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsOfService">Terms of Service</Label>
                  <Textarea
                    id="termsOfService"
                    name="termsOfService"
                    placeholder="Enter the terms of service..."
                    rows={4}
                    value={formData.termsOfService}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                  <Textarea
                    id="privacyPolicy"
                    name="privacyPolicy"
                    placeholder="Enter the privacy policy..."
                    rows={4}
                    value={formData.privacyPolicy}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </div>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
