import { useState } from 'react';
import { serviceApi } from '../lib/api';
import { toast } from 'sonner';
import { Service } from '../lib/types';

export function useServices(businessId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await serviceApi.createService({
        ...serviceData,
        businessId,
        isActive: true
      });

      if (response.data) {
        toast.success('Service created successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to create service');
        toast.error(response.message || 'Failed to create service');
        throw new Error(response.message || 'Failed to create service');
      }
    } catch (err) {
      setError('An error occurred while creating service');
      toast.error('An error occurred while creating service');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createService
  };
} 