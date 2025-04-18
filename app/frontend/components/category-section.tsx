import Link from "next/link"
import { Card } from "@/components/ui/card"
import {
  Wrench,
  Zap,
  Hammer,
  Scissors,
  Leaf,
  Car,
  Utensils,
  Briefcase,
  Stethoscope,
  PenTool,
  Brush,
  Home,
} from "lucide-react"

const categories = [
  {
    name: "Plumbing",
    icon: Wrench,
    color: "bg-blue-100 text-blue-700",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Electrical",
    icon: Zap,
    color: "bg-yellow-100 text-yellow-700",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Carpentry",
    icon: Hammer,
    color: "bg-orange-100 text-orange-700",
    image: "https://images.unsplash.com/photo-1601564921647-b446839a013f?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Salon & Spa",
    icon: Scissors,
    color: "bg-pink-100 text-pink-700",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Landscaping",
    icon: Leaf,
    color: "bg-green-100 text-green-700",
    image: "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Automotive",
    icon: Car,
    color: "bg-red-100 text-red-700",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Food & Catering",
    icon: Utensils,
    color: "bg-purple-100 text-purple-700",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Professional",
    icon: Briefcase,
    color: "bg-indigo-100 text-indigo-700",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Healthcare",
    icon: Stethoscope,
    color: "bg-teal-100 text-teal-700",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Design",
    icon: PenTool,
    color: "bg-violet-100 text-violet-700",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Cleaning",
    icon: Brush,
    color: "bg-cyan-100 text-cyan-700",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Home Services",
    icon: Home,
    color: "bg-amber-100 text-amber-700",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop",
  },
]

export function CategorySection() {
  return (
    <section className="py-12 bg-background">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={`/businesses?category=${category.name}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 z-10"></div>
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                    <span className="text-sm font-medium text-white">{category.name}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
