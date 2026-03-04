'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  Calendar,
  Loader2
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

interface TelegramStatsProps {
  chatbotId: string;
}

export default function TelegramStatsCard({ chatbotId }: TelegramStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [chatbotId, timeframe]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chatbots/${chatbotId}/telegram-stats?timeframe=${timeframe}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching telegram stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case 'day': return 'Last 24 Hours';
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'year': return 'Last Year';
      case 'all': return 'All Time';
      default: return 'Last 30 Days';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.totalConversations === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Telegram Usage Statistics
          </CardTitle>
          <CardDescription>No conversation data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Start chatting with your bot on Telegram to see statistics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Timeframe Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Telegram Usage Statistics
              </CardTitle>
              <CardDescription>{getTimeframeLabel()}</CardDescription>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {stats.totalConversations.toLocaleString()}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  Total Messages
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Unique
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {stats.uniqueUsers.toLocaleString()}
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                  Active Users
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  Peak
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                  {stats.peakHour.formatted}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                  Most Active Hour ({stats.peakHour.count} msgs)
                </p>
              </div>
            </div>
          </div>

          {/* Chart */}
          {stats.chartData && stats.chartData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Activity Timeline
              </h3>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData}>
                    <defs>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                      tickLine={{ stroke: 'currentColor' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                      tickLine={{ stroke: 'currentColor' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorMessages)"
                      name="Messages"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#8b5cf6" 
                      fillOpacity={1} 
                      fill="url(#colorUsers)"
                      name="Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-muted-foreground">Messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-muted-foreground">Active Users</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Avg/Day</p>
              <p className="text-lg font-semibold">
                {stats.chartData.length > 0 
                  ? Math.round(stats.totalConversations / stats.chartData.length)
                  : 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Avg/User</p>
              <p className="text-lg font-semibold">
                {stats.uniqueUsers > 0 
                  ? Math.round(stats.totalConversations / stats.uniqueUsers)
                  : 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Peak Day</p>
              <p className="text-lg font-semibold">
                {stats.chartData.reduce((max: any, day: any) => 
                  day.messages > (max?.messages || 0) ? day : max, {})?.messages || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Active Days</p>
              <p className="text-lg font-semibold">
                {stats.chartData.filter((day: any) => day.messages > 0).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
