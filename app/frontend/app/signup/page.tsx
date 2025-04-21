"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { authApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [accountType, setAccountType] = useState("customer")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    role: "customer",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState(1)
  const { showSuccessToast, showErrorToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAccountTypeChange = (value: string) => {
    setAccountType(value)
    setFormData(prev => ({
      ...prev,
      role: value
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeTerms: checked,
    }))

    if (errors.agreeTerms) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.agreeTerms
        return newErrors
      })
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      handleNextStep()
      return
    }

    if (!validateStep2()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.register({
        ...formData
      })

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        showSuccessToast("Signup successful", `Welcome, ${response.data.user.firstName}!`)
        router.push("/login")
       
      } else {
        showErrorToast("Signup failed", response.data.message || "An error occurred")
      }
    } catch (error: any) {
      console.error("Signup failed:", error)
      showErrorToast("Signup failed", error.response?.data?.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = () => {
    const { password } = formData
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 1

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1

    // Contains number
    if (/[0-9]/.test(password)) strength += 1

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return strength
  }

  const getPasswordStrengthText = () => {
    const strength = passwordStrength()
    if (strength === 0) return ""
    if (strength <= 2) return "Weak"
    if (strength <= 4) return "Medium"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength()
    if (strength === 0) return "bg-gray-200"
    if (strength <= 2) return "bg-red-500"
    if (strength <= 4) return "bg-orange-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image/Branding */}
      <div className="hidden md:block md:w-1/2 bg-primary-gradient">
        <div className="flex flex-col justify-center items-center h-full text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Grow Your Business with IntelliBiz</h1>
            <p className="text-lg mb-8">
              Join our platform to connect with local customers and grow your business. IntelliBiz helps service
              providers reach more clients in their area.
            </p>
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Increase Your Visibility</h3>
                  <p className="text-sm text-white/80">Get discovered by customers searching for your services</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Manage Appointments</h3>
                  <p className="text-sm text-white/80">Schedule and organize client bookings efficiently</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium">Build Your Reputation</h3>
                  <p className="text-sm text-white/80">Collect reviews and showcase your quality work</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">Join IntelliBiz to connect with local businesses</p>
          </div>

          <Tabs defaultValue="customer" onValueChange={handleAccountTypeChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="Customer">Customer</TabsTrigger>
              <TabsTrigger value="BusinessOwner">Business Owner</TabsTrigger>
            </TabsList>
            <TabsContent value="customer">
              <p className="text-sm text-gray-600 mb-6">Create an account to find and connect with local businesses.</p>
            </TabsContent>
            <TabsContent value="business">
              <p className="text-sm text-gray-600 mb-6">
                Create an account to register your business and reach more customers.
              </p>
            </TabsContent>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                    />
                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                    />
                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                  </div>
                </div>

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
                    className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Continue</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${errors.password ? "border-red-500" : ""}`}
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
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}

                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-600">Password strength:</div>
                        <div
                          className={`text-xs font-medium ${
                            passwordStrength() <= 2
                              ? "text-red-500"
                              : passwordStrength() <= 4
                                ? "text-orange-500"
                                : "text-green-500"
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </div>
                      </div>
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength() / 5) * 100}%` }}
                        ></div>
                      </div>
                      <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                        <li
                          className={`flex items-center gap-1 ${formData.password.length >= 8 ? "text-green-600" : ""}`}
                        >
                          {formData.password.length >= 8 && <CheckCircle className="h-3 w-3" />}
                          At least 8 characters
                        </li>
                        <li
                          className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? "text-green-600" : ""}`}
                        >
                          {/[A-Z]/.test(formData.password) && <CheckCircle className="h-3 w-3" />}
                          Uppercase letter
                        </li>
                        <li
                          className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? "text-green-600" : ""}`}
                        >
                          {/[a-z]/.test(formData.password) && <CheckCircle className="h-3 w-3" />}
                          Lowercase letter
                        </li>
                        <li
                          className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? "text-green-600" : ""}`}
                        >
                          {/[0-9]/.test(formData.password) && <CheckCircle className="h-3 w-3" />}
                          Number
                        </li>
                        <li
                          className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-600" : ""}`}
                        >
                          {/[^A-Za-z0-9]/.test(formData.password) && <CheckCircle className="h-3 w-3" />}
                          Special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={handleCheckboxChange}
                    className={errors.agreeTerms ? "border-red-500" : ""}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                      privacy policy
                    </Link>
                  </label>
                </div>
                {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
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
                        Creating account...
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login-portal" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
