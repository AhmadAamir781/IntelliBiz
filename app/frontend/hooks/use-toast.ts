"use client"

import { useToast as useShadcnToast } from "@/components/ui/use-toast"

export function useToast() {
  const { toast } = useShadcnToast()

  const showToast = (title: string, description?: string, variant?: "default" | "destructive") => {
    toast({
      title,
      description,
      variant,
    })
  }

  const showSuccessToast = (title: string, description?: string) => {
    showToast(title, description, "default")
  }

  const showErrorToast = (title: string, description?: string) => {
    showToast(title, description, "destructive")
  }

  return {
    showToast,
    showSuccessToast,
    showErrorToast,
  }
}
