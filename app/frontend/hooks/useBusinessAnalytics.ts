import { useState, useEffect } from 'react';
import { businessApi } from '../lib/api';
import { toast } from 'sonner';

interface AnalyticsData {
  profileViews: {
    total: number;
    change: number;
    positive: boolean;
  };
  appointments: {
    total: number;
    change: number;
    positive: boolean;
  };
  reviews: {
    total: number;
    change: number;
    positive: boolean;
  };
  messages: {
    total: number;
    change: number;
    positive: boolean;
  };
}

interface TopService {
  name: string;
  views: number;
  bookings: number;
  revenue: string;
  growth: number;
  positive: boolean;
}

interface CustomerDemographics {
  age: Array<{
    group: string;
    percentage: number;
  }>;
  gender: Array<{
    group: string;
    percentage: number;
  }>;
  location: Array<{
    area: string;
    percentage: number;
  }>;
}

interface CustomerSource {
  source: string;
  percentage: number;
}

export function useBusinessAnalytics(businessId: number, timeRange: string) {
  const [overviewData, setOverviewData] = useState<AnalyticsData | null>(null);
  const [topServices, setTopServices] = useState<TopService[]>([]);
  const [customerDemographics, setCustomerDemographics] = useState<CustomerDemographics | null>(null);
  const [customerSources, setCustomerSources] = useState<CustomerSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
 
      // Fetch overview data
      const overviewResponse = await businessApi.getBusinessAnalytics(1, timeRange);
      if (overviewResponse.data) {
        setOverviewData(overviewResponse.data.overview);
        setTopServices(overviewResponse.data.topServices);
        setCustomerDemographics(overviewResponse.data.demographics);
        setCustomerSources(overviewResponse.data.sources);
      } else {
        setError(overviewResponse.message || 'Failed to fetch analytics data');
        toast.error(overviewResponse.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError('An error occurred while fetching analytics data');
      toast.error('An error occurred while fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [businessId, timeRange]);

  return {
    overviewData,
    topServices,
    customerDemographics,
    customerSources,
    loading,
    error,
    refresh: fetchAnalytics
  };
} 