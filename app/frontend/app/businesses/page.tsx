'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBusinesses } from '@/hooks/useBusinesses';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BusinessCard } from "@/components/business-card";
import { BusinessFilters } from "@/components/business-filters";
import { Search, MapPin, SlidersHorizontal, Star, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { businessApi } from '@/lib/api';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
export default function BusinessesPage() {
  
 
    const [categories, setCategories] = useState<string[]>([]);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await businessApi.getAllCategories();
          if (response.data) {
            setCategories(response.data); // or response?.data depending on your API response shape
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
  
      fetchCategories();
    }, []);
  const router = useRouter();
  const {
    businesses,
    loading,
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
  };

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
    <div className="min-h-screen bg-muted/30">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Find Local Businesses</h1>
          <p className="text-muted-foreground">Browse and connect with trusted local service providers in your area</p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search businesses, services..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="relative w-full md:max-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Location" 
                className="pl-9" 
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <select className="text-sm border rounded-md px-3 py-2 bg-background h-10">
              <option>Relevance</option>
              <option>Rating: High to Low</option>
              <option>Rating: Low to High</option>
              <option>Name: A to Z</option>
            </select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <BusinessFilters />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
      {categories.map((cat) => (
        <Badge
          key={cat}
          variant={category === cat ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleCategoryChange(cat === 'All' ? null : cat)}
        >
          {cat}
        </Badge>
      ))}
    </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{loading ? '...' : businesses.length}</span> businesses
          </p>
        </div>

        {/* Business Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
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
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No businesses found</p>
            </div>
          ) : (
            businesses.map((business) => (
              <div key={business.id} onClick={() => handleBusinessClick(business.id)}>
                <BusinessCard 
                  business={{
                    id: business.id.toString(),
                    name: business.name,
                    category: business.category,
                    rating: 5, // Using placeholder rating until real data is available
                    reviewCount: 100, // Using placeholder count until real data is available
                    description: business.description,
                    address: business.address,
                    phone: business.phoneNumber || "(555) 123-4567", // Using placeholder if no phone
                    image: business.imageUrl,
                    verified: business.isVerified
                  }} 
                />
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && businesses.length > 0 && (
          <div className="flex justify-center mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(businesses.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(prev => Math.min(Math.ceil(businesses.length / itemsPerPage), prev + 1))}
                    className={currentPage === Math.ceil(businesses.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""}
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