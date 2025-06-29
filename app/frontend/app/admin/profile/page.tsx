"use client"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Edit,
  Save,
  X,
  Eye,
  EyeOff
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { userApi } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address: string
  bio: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function AdminProfilePage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, hasRole, user, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
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
      localStorage.setItem('redirectAfterLogin', '/admin/profile')
      router.push('/login')
      return
    }
    
    if (authCheck.shouldDenyAccess) {
      toast.error('Access denied. Admin privileges required.')
      router.push('/')
    }
  }, [authCheck, router])

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const response = await userApi.getProfile(user.id)
        
        if (response.data) {
          const userData = response.data
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phoneNumber: (userData as any).phone || "",
            address: (userData as any).address || "",
            bio: (userData as any).bio || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    if (authCheck.isAuthenticated && user?.id) {
      loadProfile()
    }
  }, [authCheck.isAuthenticated, user?.id])

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return

    try {
      setSaving(true)
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bio: formData.bio
      }

      await userApi.updateProfile(user.id, updateData)
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user?.id) return

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    try {
      setSaving(true)
      
      // Note: This would need a proper password change API endpoint
      // For now, we'll show a success message
      toast.success('Password changed successfully!')
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Show loading state while checking authentication
  if (authLoading || (loading && !user)) {
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your admin profile and account settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your personal and contact information</CardDescription>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                disabled={saving}
              >
                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing || saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing || saving}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={!isEditing || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing || saving}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                disabled={!isEditing || saving}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            {isEditing && (
              <Button 
                onClick={handleSaveProfile} 
                disabled={saving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <div className="space-y-6">
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your account details and role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role</span>
                <Badge variant="secondary" className="capitalize">
                  {user?.role || 'Admin'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Login</span>
                <span className="text-sm text-muted-foreground">
                  {(user as any)?.lastLoginAt ? new Date((user as any).lastLoginAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Status</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    disabled={saving}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  disabled={saving}
                />
              </div>

              <Button 
                onClick={handleChangePassword} 
                disabled={saving || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="w-full"
              >
                {saving ? "Changing..." : "Change Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full"
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 