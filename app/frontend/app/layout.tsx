import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientOnlyProviders from "./client-only-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IntelliBiz - Local Business Promotion App",
  description: "Connect with local businesses and service providers in your area",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientOnlyProviders>
          {children}
        </ClientOnlyProviders>
      </body>
    </html>
  )
}
