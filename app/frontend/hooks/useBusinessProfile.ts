import { useState, useEffect } from 'react';
import { businessApi } from '../lib/api';
import { toast } from 'sonner';
import { Business } from '../lib/types';

export function useBusinessProfile(businessId: number) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await businessApi.getBusinessById(businessId);
      if (response.data) {
        setBusiness(response.data);
      } else {
        setError(response.message || 'Failed to fetch business profile');
        toast.error(response.message || 'Failed to fetch business profile');
      }
    } catch (err) {
      setError('An error occurred while fetching business profile');
      toast.error('An error occurred while fetching business profile');
    } finally {
      setLoading(false);
    }
  };

  const updateBusiness = async (businessData: Partial<Business>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await businessApi.updateBusiness(businessId, businessData);
      if (response.data) {
        setBusiness(response.data);
        toast.success('Business profile updated successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to update business profile');
        toast.error(response.message || 'Failed to update business profile');
        throw new Error(response.message || 'Failed to update business profile');
      }
    } catch (err) {
      setError('An error occurred while updating business profile');
      toast.error('An error occurred while updating business profile');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  return {
    business,
    loading,
    error,
    isSubmitting,
    refresh: fetchBusiness,
    updateBusiness
  };
} 