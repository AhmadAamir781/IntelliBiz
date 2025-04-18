'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Filter, Star, ChevronRight } from 'lucide-react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

const categories = [
  'All',
  'Beauty & Spa',
  'Health & Wellness',
  'Fitness',
  'Education',
  'Professional Services',
  'Retail',
  'Food & Beverage',
  'Entertainment',
  'Other'
];

export default function BusinessesPage() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Local Businesses</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
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
            <Card
              key={business.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleBusinessClick(business.id)}
            >
              <div className="relative h-48">
                <img
                  src={business.imageUrl || '/placeholder-business.jpg'}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
                {business.isVerified && (
                  <Badge className="absolute top-2 right-2">Verified</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{business.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{5}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">{business.category}</p>
                <p className="text-sm line-clamp-2 mb-4">{business.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{business.address}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <Button variant="ghost" className="w-full justify-between">
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {!loading && businesses.length > 0 && (
        <div className="mt-8 flex justify-center">
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
  );
}
