import { useState } from 'react';
import { businessApi } from '../lib/api';
import { toast } from 'sonner';
import { Business } from '../lib/types';

export function useBusinessSettings(businessId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBusiness = async (businessData: Partial<Business>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await businessApi.updateBusiness(businessId, {
        ...businessData,
        id: businessId
      });

      if (response.success) {
        toast.success('Business settings updated successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to update business settings');
        toast.error(response.message || 'Failed to update business settings');
        throw new Error(response.message || 'Failed to update business settings');
      }
    } catch (err) {
      setError('An error occurred while updating business settings');
      toast.error('An error occurred while updating business settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateBusiness
  };
} 