"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Database,
  Mail,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { settingsApi } from "@/lib/api"
import { Settings } from "@/lib/types"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface ExtendedSettings extends Settings {
  // Additional settings not in the base Settings type
  siteDescription?: string
  supportPhone?: string
  autoApproveBusinesses?: boolean
  requireBusinessVerification?: boolean
  maxBusinessesPerUser?: number
  autoApproveReviews?: boolean
  requireReviewModeration?: boolean
  maxReviewsPerUser?: number
  emailNotifications?: boolean
  smsNotifications?: boolean
  adminNotifications?: boolean
  sessionTimeout?: number
  maxLoginAttempts?: number
  requireTwoFactor?: boolean
  maintenanceMode?: boolean
  maintenanceMessage?: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, hasRole } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<ExtendedSettings>({
    siteName: "IntelliBiz",
    adminEmail: "admin@intellibiz.com",
    supportEmail: "support@intellibiz.com",
    defaultCurrency: "USD",
    termsOfService: "",
    privacyPolicy: "",
    siteDescription: "Your trusted business directory",
    supportPhone: "+1 (555) 123-4567",
    autoApproveBusinesses: false,
    requireBusinessVerification: true,
    maxBusinessesPerUser: 5,
    autoApproveReviews: false,
    requireReviewModeration: true,
    maxReviewsPerUser: 10,
    emailNotifications: true,
    smsNotifications: false,
    adminNotifications: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    requireTwoFactor: false,
    maintenanceMode: false,
    maintenanceMessage: "We're currently performing maintenance. Please check back soon."
  })

  // Memoize authentication check to prevent unnecessary re-renders
  const authCheck = useMemo(() => ({
    isAuthenticated,
    hasRole: hasRole('Admin'),
    shouldRedirect: !authLoading && !isAuthenticated,
    shouldDenyAccess: !authLoading && isAuthenticated && !hasRole('Admin')
  }), [isAuthenticated, authLoading, hasRole])

  // Check authentication and admin role
  useEffect(() => {
    if (authCheck.shouldRedirect) {
      localStorage.setItem('redirectAfterLogin', '/admin/settings')
      router.push('/login')
      return
    }
    
    if (authCheck.shouldDenyAccess) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
    }
  }, [authCheck, router])

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        const response = await settingsApi.getSettings()
        
        if (response.data) {
          setSettings(prev => ({
            ...prev,
            ...response.data
          }))
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    if (authCheck.isAuthenticated && authCheck.hasRole) {
      loadSettings()
    }
  }, [authCheck.isAuthenticated, authCheck.hasRole])

  const handleSettingChange = (key: keyof ExtendedSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      
      // Extract only the base Settings properties for the API call
      const baseSettings: Settings = {
        siteName: settings.siteName,
        adminEmail: settings.adminEmail,
        supportEmail: settings.supportEmail,
        defaultCurrency: settings.defaultCurrency,
        termsOfService: settings.termsOfService,
        privacyPolicy: settings.privacyPolicy
      }
      
      await settingsApi.updateSettings(baseSettings)
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = async () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      try {
        setSaving(true)
        
        const defaultSettings: ExtendedSettings = {
          siteName: "IntelliBiz",
          adminEmail: "admin@intellibiz.com",
          supportEmail: "support@intellibiz.com",
          defaultCurrency: "USD",
          termsOfService: "",
          privacyPolicy: "",
          siteDescription: "Your trusted business directory",
          supportPhone: "+1 (555) 123-4567",
          autoApproveBusinesses: false,
          requireBusinessVerification: true,
          maxBusinessesPerUser: 5,
          autoApproveReviews: false,
          requireReviewModeration: true,
          maxReviewsPerUser: 10,
          emailNotifications: true,
          smsNotifications: false,
          adminNotifications: true,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          requireTwoFactor: false,
          maintenanceMode: false,
          maintenanceMessage: "We're currently performing maintenance. Please check back soon."
        }
        
        // Save base settings to API
        const baseSettings: Settings = {
          siteName: defaultSettings.siteName,
          adminEmail: defaultSettings.adminEmail,
          supportEmail: defaultSettings.supportEmail,
          defaultCurrency: defaultSettings.defaultCurrency,
          termsOfService: defaultSettings.termsOfService,
          privacyPolicy: defaultSettings.privacyPolicy
        }
        
        await settingsApi.updateSettings(baseSettings)
        setSettings(defaultSettings)
        
        toast.success('Settings reset to default!')
      } catch (error) {
        console.error('Error resetting settings:', error)
        toast.error('Failed to reset settings')
      } finally {
        setSaving(false)
      }
    }
  }

  // Show loading state while checking authentication
  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  // Don't render content if not authenticated or not an admin
  if (!authCheck.isAuthenticated || !authCheck.hasRole) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={handleResetSettings}
          disabled={saving}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button 
          onClick={handleSaveSettings}
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription || ""}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                disabled={saving}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone || ""}
                onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Default Currency</Label>
              <Input
                id="defaultCurrency"
                value={settings.defaultCurrency}
                onChange={(e) => handleSettingChange('defaultCurrency', e.target.value)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Business Settings
            </CardTitle>
            <CardDescription>Business registration and verification rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve Businesses</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve new business registrations
                </p>
              </div>
              <Switch
                checked={settings.autoApproveBusinesses || false}
                onCheckedChange={(checked) => handleSettingChange('autoApproveBusinesses', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Business Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require manual verification for new businesses
                </p>
              </div>
              <Switch
                checked={settings.requireBusinessVerification || false}
                onCheckedChange={(checked) => handleSettingChange('requireBusinessVerification', checked)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBusinesses">Max Businesses per User</Label>
              <Select
                value={(settings.maxBusinessesPerUser || 5).toString()}
                onValueChange={(value) => handleSettingChange('maxBusinessesPerUser', parseInt(value))}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Review Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Review Settings
            </CardTitle>
            <CardDescription>Review moderation and approval rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve Reviews</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve new reviews
                </p>
              </div>
              <Switch
                checked={settings.autoApproveReviews || false}
                onCheckedChange={(checked) => handleSettingChange('autoApproveReviews', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Review Moderation</Label>
                <p className="text-sm text-muted-foreground">
                  Require manual moderation for reviews
                </p>
              </div>
              <Switch
                checked={settings.requireReviewModeration || false}
                onCheckedChange={(checked) => handleSettingChange('requireReviewModeration', checked)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxReviews">Max Reviews per User</Label>
              <Select
                value={(settings.maxReviewsPerUser || 10).toString()}
                onValueChange={(value) => handleSettingChange('maxReviewsPerUser', parseInt(value))}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications || false}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications via SMS
                </p>
              </div>
              <Switch
                checked={settings.smsNotifications || false}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                disabled={saving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Admin Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send notifications to admin users
                </p>
              </div>
              <Switch
                checked={settings.adminNotifications || false}
                onCheckedChange={(checked) => handleSettingChange('adminNotifications', checked)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Security and authentication configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Select
                value={(settings.sessionTimeout || 30).toString()}
                onValueChange={(value) => handleSettingChange('sessionTimeout', parseInt(value))}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Select
                value={(settings.maxLoginAttempts || 5).toString()}
                onValueChange={(value) => handleSettingChange('maxLoginAttempts', parseInt(value))}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                  <SelectItem value="10">10 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch
                checked={settings.requireTwoFactor || false}
                onCheckedChange={(checked) => handleSettingChange('requireTwoFactor', checked)}
                disabled={saving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Maintenance Settings
            </CardTitle>
            <CardDescription>System maintenance and downtime configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable maintenance mode for the platform
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode || false}
                onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                disabled={saving}
              />
            </div>

            {(settings.maintenanceMode || false) && (
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenanceMessage || ""}
                  onChange={(e) => handleSettingChange('maintenanceMessage', e.target.value)}
                  disabled={saving}
                  rows={3}
                  placeholder="Message to display during maintenance..."
                />
              </div>
            )}

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Warning</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Changes to these settings will affect all users. Please review carefully before saving.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
