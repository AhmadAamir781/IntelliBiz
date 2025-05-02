"use client"

// Direct export of the shadcn toast functionality for more direct control
import { useToast, toast } from "@/components/ui/use-toast"

export function useShadcnToast() {
  const { toast, dismiss, toasts } = useToast()
  
  return {
    toast,
    dismiss,
    toasts
  }
}

// Also export the direct toast function
export { toast } 