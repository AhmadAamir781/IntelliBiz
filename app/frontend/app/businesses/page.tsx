'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useBusinesses } from '@/hooks/useBusinesses';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/components/business-card";
import { BusinessFilters } from "@/components/business-filters";
import { Search, MapPin, SlidersHorizontal, Star, ChevronRight, Link as LucideLink, ArrowLeft, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { businessApi, reviewApi } from '@/lib/api';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Review } from '@/lib/types';

export default function BusinessesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [businessReviews, setBusinessReviews] = useState<Review[]>([]);
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', '/businesses');
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);
  
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await businessApi.getAllCategories();
        if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  
  const {
    businesses,
    loading: businessesLoading,
    error,
    searchTerm,
    category,
    location,
    handleSearch,
    handleCategoryChange,
    handleLocationChange,
    refetch
  } = useBusinesses();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const handleBusinessClick = (id: number) => {
    router.push(`/businesses/${id}`);
    // Get reviews asynchronously
    reviewApi.getReviewsByBusiness(id).then(response => {
      if (response.data) {
        setBusinessReviews(response.data);
      }
    }).catch(error => {
      console.error("Error fetching reviews:", error);
    });
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Gradient Header Section */}
      <section className="bg-gradient-to-r from-primary/90 to-primary py-12 md:py-16 text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-primary-foreground hover:text-primary-foreground/90 flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-4 text-primary-foreground">Find Local Businesses</h1>
            <p className="text-primary-foreground/80">Browse and connect with trusted local service providers in your area</p>
          </div>

          {/* Search and Filter Section */}
          <Card className="border-none bg-gradient-to-r from-primary/90 to-primary">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="border-none flex-1 flex gap-2">
                  <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search businesses, services..."
                      className="pl-9 border-input"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <div className="relative w-full md:max-w-[200px]">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Location"
                      className="pl-9 border-input"
                      value={location}
                      onChange={(e) => handleLocationChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <select className="text-sm border rounded-md px-3 py-2 bg-background h-10 border-input">
                    <option>Relevance</option>
                    <option>Rating: High to Low</option>
                    <option>Rating: Low to High</option>
                    <option>Name: A to Z</option>
                  </select>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="flex gap-2 h-10">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">Filters</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="border-l border-border">
                      <BusinessFilters />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container px-4 py-8 md:px-6">
        {/* Categories */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <Badge
            key="all-categories"
            variant={category === null ? 'default' : 'outline'}
            className="cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors"
            onClick={() => handleCategoryChange(null)}
          >
            All Categories
          </Badge>
          {[...new Set(categories)].map((cat) => (
            <Badge
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap hover:bg-primary/90 transition-colors"
              onClick={() => handleCategoryChange(cat === 'All' ? null : cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6 border-b border-border/30 pb-2">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{businessesLoading ? '...' : businesses.length}</span> businesses
          </p>
        </div>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessesLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))
          ) : businesses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No businesses found</p>
              <Button onClick={refetch} className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                Reset Filters
              </Button>
            </div>
          ) : (
            businesses.map((business) => (
              <div key={business.id} onClick={() => handleBusinessClick(business.id)} className="cursor-pointer transition-transform hover:scale-[1.01]">
                <BusinessCard
                  business={{
                    id: parseInt(business.id.toString()),
                    name: business.name,
                    category: business.category,
                    rating: businessReviews.length > 0 ? businessReviews.reduce((sum, review) => sum + review.rating, 0) / businessReviews.length : 0, 
                    reviewCount: businessReviews.length,
                    description: business.description,
                    address: business.address,
                    phoneNumber: business.phoneNumber || "(555) 123-4567",
                    imageUrl: business.imageUrl,
                    isVerified: business.isVerified,
                    city: business.city,
                    state: business.state,
                    zipCode: business.zipCode,
                    email: business.email,
                    website: business.website,
                    ownerId: business.ownerId,
                    createdAt: business.createdAt,
                    updatedAt: business.updatedAt,
                    status: business.status
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!businessesLoading && businesses.length > 0 && (
          <div className="flex justify-center mt-12">
            <Pagination>
              <PaginationContent className="shadow-sm rounded-lg p-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""} hover:bg-accent hover:text-accent-foreground transition-colors`}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(businesses.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className={`hover:bg-accent hover:text-accent-foreground transition-colors ${currentPage === page ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(businesses.length / itemsPerPage), prev + 1))}
                    className={`${currentPage === Math.ceil(businesses.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""} hover:bg-accent hover:text-accent-foreground transition-colors`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}