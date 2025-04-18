"use client"

import { useEffect, useState, type ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AIChatbot } from "@/components/ai-chatbot"

type Props = {
  children: ReactNode
}

export default function ClientOnlyProviders({ children }: Props) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Wait until mounted to avoid hydration mismatch
  if (!isMounted) return <div className="opacity-0" aria-hidden="true">{children}</div>

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
      <AIChatbot />
    </ThemeProvider>
  )
}
