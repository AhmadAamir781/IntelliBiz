import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { CheckCircle, Users, Award, Target, ArrowLeft } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-6">
          <Link href="/" className="text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-col items-center mb-12">
          <Logo size="lg" />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-center">About IntelliBiz</h1>
          <p className="mt-4 text-xl text-muted-foreground text-center max-w-3xl">
            Connecting local businesses with customers in their community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              At IntelliBiz, our mission is to empower local businesses by providing them with the digital tools and
              platform they need to thrive in today's competitive marketplace. We believe that local businesses are the
              backbone of our communities, and we're committed to helping them succeed.
            </p>
            <p className="text-muted-foreground mb-6">
              We strive to create meaningful connections between service providers and customers, making it easier for
              people to discover and support businesses in their area. By bridging this gap, we help foster stronger
              local economies and more vibrant communities.
            </p>
            <div className="bg-primary-gradient p-6 rounded-lg text-white">
              <h3 className="text-xl font-medium mb-3">Our Values</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Community-focused approach to business growth</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Transparency and trust in all our operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Innovation that serves real business needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>Accessibility for businesses of all sizes</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070&auto=format&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577412647305-991150c7d163?q=80&w=2070&auto=format&fit=crop"
                  alt="Local business"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
                  alt="Community support"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Choose IntelliBiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Community-Focused</h3>
              <p className="text-muted-foreground">
                We prioritize building strong connections between local businesses and their communities, fostering
                economic growth and neighborhood vitality.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground">
                Our verification process ensures that businesses listed on our platform meet high standards of service,
                giving customers confidence in their choices.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Targeted Solutions</h3>
              <p className="text-muted-foreground">
                We provide tailored tools and features that address the specific needs of local service providers,
                helping them reach their target audience effectively.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Our Story</h2>
          <div className="bg-card p-8 rounded-lg shadow-sm border">
            <p className="text-muted-foreground mb-4">
              IntelliBiz was founded in 2023 by a team of entrepreneurs who recognized the challenges faced by local
              businesses in the digital age. Having worked with small businesses for years, our founders saw firsthand
              how difficult it was for these businesses to establish an online presence and connect with potential
              customers.
            </p>
            <p className="text-muted-foreground mb-4">
              What began as a simple directory has evolved into a comprehensive platform that offers a range of tools
              and services designed to help local businesses thrive. Today, IntelliBiz serves thousands of businesses
              across multiple cities, with plans to expand nationwide.
            </p>
            <p className="text-muted-foreground">
              Our team is made up of passionate individuals who believe in the power of local commerce. We're committed
              to continuous improvement and innovation, always looking for new ways to support the businesses and
              communities we serve.
            </p>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-6">Join Our Community</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're a business owner looking to grow your customer base or a consumer seeking quality local
            services, IntelliBiz is here to help. Join our community today and be part of the local business revolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register-business">Register Your Business</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/businesses">Find Local Services</Link>
            </Button>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-center text-muted-foreground">
            Have questions? Contact us at{" "}
            <a href="mailto:info@intellibiz.com" className="text-primary hover:underline">
              info@intellibiz.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
