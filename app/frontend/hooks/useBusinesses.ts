import { useState, useEffect } from 'react';
import { businessApi } from '../lib/api';
import { toast } from 'sonner';
import { Business } from '../lib/types';

export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [location, setLocation] = useState('');

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
  
      let axiosResponse;
      if (searchTerm || category) {
        axiosResponse = await businessApi.searchBusinesses(searchTerm, category || undefined);
      } else {
        axiosResponse = await businessApi.getAllBusinesses();
      }
  
      setBusinesses(axiosResponse.data); // Just set directly if it's an array
    } catch (err) {
      setError('An error occurred while fetching businesses');
      toast.error('An error occurred while fetching businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [searchTerm, category]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (newCategory: string | null) => {
    setCategory(newCategory);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
  };

  return {
    businesses,
    loading,
    error,
    searchTerm,
    category,
    location,
    handleSearch,
    handleCategoryChange,
    handleLocationChange,
    refetch: fetchBusinesses
  };
} 