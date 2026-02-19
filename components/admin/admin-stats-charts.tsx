'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartData {
  name: string;
  users: number;
  chatbots: number;
}

type Timeline = 'week' | 'month' | 'year' | 'all';

export function AdminStatsCharts() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<Timeline>('week');

  useEffect(() => {
    fetchChartData();
  }, [timeline]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats/chart-data?timeline=${timeline}`);
      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grafik Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTimelineLabel = () => {
    switch (timeline) {
      case 'week':
        return '7 hari terakhir';
      case 'month':
        return 'bulan ini';
      case 'year':
        return 'tahun ini';
      case 'all':
        return 'semua waktu';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Grafik Statistik</CardTitle>
            <CardDescription>
              Visualisasi data pengguna dan chatbot {getTimelineLabel()}
            </CardDescription>
          </div>
          <Tabs value={timeline} onValueChange={(value) => setTimeline(value as Timeline)} className="w-auto">
            <TabsList>
              <TabsTrigger value="week">Minggu</TabsTrigger>
              <TabsTrigger value="month">Bulan</TabsTrigger>
              <TabsTrigger value="year">Tahun</TabsTrigger>
              <TabsTrigger value="all">Semua</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="area" className="space-y-4">
          <TabsList>
            <TabsTrigger value="area">Area Chart</TabsTrigger>
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="area" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Pengguna"
                  />
                  <Area
                    type="monotone"
                    dataKey="chatbots"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Chatbot"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="bar" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#8884d8" name="Pengguna" />
                  <Bar dataKey="chatbots" fill="#82ca9d" name="Chatbot" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="line" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    name="Pengguna"
                  />
                  <Line
                    type="monotone"
                    dataKey="chatbots"
                    stroke="#82ca9d"
                    name="Chatbot"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
