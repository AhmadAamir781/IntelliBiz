import { useState, useEffect } from 'react';
import { serviceApi } from '../lib/api';
import { toast } from 'sonner';
import { Service } from '../lib/types';

export function useService(serviceId: number) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchService = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await serviceApi.getServiceById(serviceId);
      if (response.data) {
        setService(response.data);
      } else {
        setError(response.message || 'Failed to fetch service');
        toast.error(response.message || 'Failed to fetch service');
      }
    } catch (err) {
      setError('An error occurred while fetching service');
      toast.error('An error occurred while fetching service');
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceData: Partial<Service>) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await serviceApi.updateService(serviceId, serviceData);
      if (response.data) {
        setService(response.data);
        toast.success('Service updated successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to update service');
        toast.error(response.message || 'Failed to update service');
        throw new Error(response.message || 'Failed to update service');
      }
    } catch (err) {
      setError('An error occurred while updating service');
      toast.error('An error occurred while updating service');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await serviceApi.toggleServiceActive(serviceId);
      if (response.data) {
        setService(response.data);
        toast.success('Service status updated successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to update service status');
        toast.error(response.message || 'Failed to update service status');
        throw new Error(response.message || 'Failed to update service status');
      }
    } catch (err) {
      setError('An error occurred while updating service status');
      toast.error('An error occurred while updating service status');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  return {
    service,
    loading,
    error,
    isSubmitting,
    refresh: fetchService,
    updateService,
    toggleActive
  };
} 