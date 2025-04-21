import { useState, useEffect } from 'react';
import { businessApi } from '../lib/api';
import { toast } from 'sonner';
import { Business } from '../lib/types';

export function useBusinessLocation(businessId: number) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await businessApi.getBusinessById(2021);
      if (response.data) {
        setBusiness(response.data);
      } else {
        setError(response.message || 'Failed to fetch business details');
        toast.error(response.message || 'Failed to fetch business details');
      }
    } catch (err) {
      setError('An error occurred while fetching business details');
      toast.error('An error occurred while fetching business details');
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (locationData: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }) => {
    try {
      if (!business) {
        throw new Error('Business not found');
      }

      const updatedBusiness = {
        ...business,
        ...locationData
      };

      const response = await businessApi.updateBusiness(businessId, updatedBusiness);
      if (response.success) {
        setBusiness(response.data);
        toast.success('Location updated successfully');
        return response.data;
      } else {
        toast.error(response.message || 'Failed to update location');
        throw new Error(response.message || 'Failed to update location');
      }
    } catch (err) {
      toast.error('An error occurred while updating location');
      throw err;
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  return {
    business,
    loading,
    error,
    refresh: fetchBusiness,
    updateLocation
  };
} 