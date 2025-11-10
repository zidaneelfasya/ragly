import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface SummaryData {
  overview: {
    total: number;
    recentActivity: number;
    accessLevel: string;
  };
  statusStats: Record<string, number>;
  kategoriStats: Record<string, number>;
  topikStats: Record<string, number>;
  provinsiStats: Record<string, number>;
  keywordStats: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    monthName: string;
    count: number;
  }>;
  unitStats: Array<{
    unit_id: number;
    unit_name: string;
    count: number;
  }>;
  topKeywords: Array<{
    keyword: string;
    count: number;
    color: string;
  }>;
  charts: {
    statusDistribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    kategoriDistribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    topikDistribution: Array<{
      name: string;
      fullName: string;
      value: number;
      color: string;
    }>;
  };
}

export function useSummaryData() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/konsultasi/summary');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch summary data: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch summary data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching summary data:', err);
      
      toast.error('Gagal memuat data ringkasan', {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchSummaryData();
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  return {
    data,
    loading,
    error,
    refreshData
  };
}
