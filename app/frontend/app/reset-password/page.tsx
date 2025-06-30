"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api"
import { Logo } from "@/components/logo"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token") || ""
    const [password, setPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { showSuccessToast, showErrorToast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await authApi.resetPassword(token, password)
            if (response.data?.success) {
                showSuccessToast("Password reset successful!", "You can now log in with your new password.")
                router.push("/login")
            } else {
                showErrorToast("Reset failed", response.data?.message || "An error occurred")
            }
        } catch (error: any) {
            showErrorToast("Reset failed", error.response?.data?.message || "An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center">
                        <Logo size="lg" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                New password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}