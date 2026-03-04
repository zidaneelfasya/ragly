import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: chatbotId } = await params;

    // Get timeframe from query params (default: 30 days)
    const searchParams = request.nextUrl.searchParams;
    const timeframe = searchParams.get('timeframe') || 'month';

    // Calculate date range based on timeframe
    let startDate = new Date();
    switch (timeframe) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    // Get total conversations count
    const { count: totalConversations, error: countError } = await supabase
      .from('telegram_conversations')
      .select('*', { count: 'exact', head: true })
      .eq('chatbot_id', chatbotId)
      .gte('timestamp', startDate.toISOString());

    if (countError) throw countError;

    // Get unique users count
    const { data: uniqueUsersData, error: uniqueUsersError } = await supabase
      .from('telegram_conversations')
      .select('telegram_user_id')
      .eq('chatbot_id', chatbotId)
      .gte('timestamp', startDate.toISOString());

    if (uniqueUsersError) throw uniqueUsersError;

    const uniqueUsers = new Set(uniqueUsersData?.map(row => row.telegram_user_id) || []).size;

    // Get conversations grouped by date for chart
    const { data: conversationsData, error: conversationsError } = await supabase
      .from('telegram_conversations')
      .select('timestamp, telegram_user_id, telegram_chat_id')
      .eq('chatbot_id', chatbotId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (conversationsError) throw conversationsError;

    // Group conversations by date
    const conversationsByDate: { [key: string]: number } = {};
    const usersByDate: { [key: string]: Set<string> } = {};
    
    conversationsData?.forEach((conv) => {
      const date = new Date(conv.timestamp);
      let dateKey: string;
      
      // Format date based on timeframe
      if (timeframe === 'day') {
        dateKey = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === 'week' || timeframe === 'month') {
        dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timeframe === 'year') {
        dateKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } else {
        dateKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      }
      
      conversationsByDate[dateKey] = (conversationsByDate[dateKey] || 0) + 1;
      
      if (!usersByDate[dateKey]) {
        usersByDate[dateKey] = new Set();
      }
      usersByDate[dateKey].add(conv.telegram_user_id);
    });

    // Convert to chart data format
    const chartData = Object.entries(conversationsByDate).map(([date, count]) => ({
      date,
      messages: count,
      users: usersByDate[date]?.size || 0,
    }));

    // Get recent conversations for activity feed
    const { data: recentConversations, error: recentError } = await supabase
      .from('telegram_conversations')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (recentError) throw recentError;

    // Get peak hour statistics
    const hourlyStats: { [key: number]: number } = {};
    conversationsData?.forEach((conv) => {
      const hour = new Date(conv.timestamp).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourlyStats).reduce(
      (max, [hour, count]) => (count > max.count ? { hour: parseInt(hour), count } : max),
      { hour: 0, count: 0 }
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalConversations: totalConversations || 0,
        uniqueUsers,
        chartData,
        recentConversations: recentConversations || [],
        peakHour: {
          hour: peakHour.hour,
          count: peakHour.count,
          formatted: `${peakHour.hour.toString().padStart(2, '0')}:00`,
        },
        timeframe,
        dateRange: {
          start: startDate.toISOString(),
          end: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching telegram stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
