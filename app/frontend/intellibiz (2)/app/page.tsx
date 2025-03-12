import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { FeaturedBusinesses } from "@/components/featured-businesses"
import { CategorySection } from "@/components/category-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
              Find Local Services in Your Area
            </h1>
            <p className="mx-auto max-w-[700px] text-white md:text-xl">
              Connect with trusted local businesses for all your service needs. From plumbers to barbers, find the right
              professional near you.
            </p>
            <div className="w-full max-w-md mt-4">
              <SearchBar />
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild size="lg" variant="secondary">
                <Link href="/businesses">Browse All Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                <Link href="/register-business">Register Your Business</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Businesses */}
      <section className="py-12 bg-muted/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Featured Businesses</h2>
          <FeaturedBusinesses />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-12">How IntelliBiz Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Search</h3>
              <p className="text-muted-foreground">Find local services based on your location and requirements</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M17 6.1H3"></path>
                  <path d="M21 12.1H3"></path>
                  <path d="M15.1 18H3"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Compare</h3>
              <p className="text-muted-foreground">View profiles, ratings, and reviews to make informed decisions</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Connect</h3>
              <p className="text-muted-foreground">Book appointments and communicate directly with service providers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Ready to grow your business?</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Join thousands of local businesses that use IntelliBiz to reach new customers and grow their client base.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/register-business">Register Your Business</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

