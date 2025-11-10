import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from 'recharts';

interface TopikChartData {
  charts: {
    topikDistribution: Array<{
      name: string;
      fullName: string;
      value: number;
      color: string;
    }>;
  };
}

interface TopikChartProps {
  data: TopikChartData | null;
  loading: boolean;
  error?: string | null;
}

// Custom tooltip for topik chart
const TopikTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 max-w-xs">
        <p className="text-sm font-medium">{data.fullName}</p>
        <p className="text-sm text-primary">
          Konsultasi: {payload[0].value}
        </p>
        <p className="text-xs text-muted-foreground">
          {((payload[0].value / data.total) * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export function TopikDistributionChart({ data, loading, error }: TopikChartProps) {
  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <Skeleton className="h-5 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              {error || 'Gagal memuat data distribusi topik'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { charts } = data;

  if (!charts.topikDistribution || charts.topikDistribution.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg">Distribusi Topik Konsultasi</CardTitle>
          <CardDescription>
            Top 10 topik konsultasi yang paling sering dibahas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Belum ada data topik konsultasi</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add total to pie chart data for percentage calculation
  const topikTotal = charts.topikDistribution.reduce((sum, item) => sum + item.value, 0);
  const topikWithTotal = charts.topikDistribution.map(item => ({ ...item, total: topikTotal }));

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg">Distribusi Topik Konsultasi</CardTitle>
        <CardDescription>
          Persentase topik konsultasi yang paling sering dibahas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={topikWithTotal}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {topikWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<TopikTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
