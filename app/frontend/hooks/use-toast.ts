"use client"

import { useToast as useShadcnToast } from "@/components/ui/use-toast"

export function useToast() {
  const { toast, toasts } = useShadcnToast()

  // For debugging
  if (typeof window !== 'undefined') {
    console.log('Current toasts:', toasts)
  }

  const showToast = (
    title: string, 
    description?: string, 
    variant: "default" | "destructive" = "default",
    duration: number = 5000
  ) => {
    console.log(`Showing toast: ${title}, ${description}`)
    
    toast({
      title,
      description,
      variant,
      duration,
    })
  }

  const showSuccessToast = (title: string, description?: string) => {
    showToast(title, description, "default", 5000)
  }

  const showErrorToast = (title: string, description?: string) => {
    // For debugging
    console.log(`Showing error toast: ${title}, ${description}`)
    
    showToast(title, description, "destructive", 7000)
  }

  return {
    toasts,
    showToast,
    showSuccessToast,
    showErrorToast,
  }
}
