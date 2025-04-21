import { useState, useEffect } from 'react';
import { businessApi } from '../lib/api';
import { toast } from 'sonner';
import { BusinessDetailDto } from '../lib/types';

export function useBusinessDetail(businessId: number) {
  const [business, setBusiness] = useState<BusinessDetailDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchBusinessDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessApi.getBusinessDetail(businessId); //TODO
      setBusiness(response.data);

    } catch (err) {
      setError('An error occurred while fetching business details');
      toast.error('An error occurred while fetching business details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchBusinessDetail();
    }
  }, [businessId]);

  return {
    business,
    loading,
    error,
    refetch: fetchBusinessDetail
  };
} 