import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const timeline = searchParams.get('timeline') || 'week';

    // Check authentication and admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get data based on timeline
    const data = [];
    const today = new Date();
    
    if (timeline === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        const { count: chatbotCount } = await supabase
          .from('chatbots')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        data.push({
          name: date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
          users: userCount || 0,
          chatbots: chatbotCount || 0,
        });
      }
    } else if (timeline === 'month') {
      // Current month by days
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(today.getFullYear(), today.getMonth(), i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        const { count: chatbotCount } = await supabase
          .from('chatbots')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        data.push({
          name: `${i}`,
          users: userCount || 0,
          chatbots: chatbotCount || 0,
        });
      }
    } else if (timeline === 'year') {
      // Current year by months
      for (let i = 0; i < 12; i++) {
        const date = new Date(today.getFullYear(), i, 1);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(today.getFullYear(), i + 1, 1);

        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        const { count: chatbotCount } = await supabase
          .from('chatbots')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        data.push({
          name: date.toLocaleDateString('id-ID', { month: 'short' }),
          users: userCount || 0,
          chatbots: chatbotCount || 0,
        });
      }
    } else if (timeline === 'all') {
      // All time by years
      const { data: firstProfile } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      const { data: firstChatbot } = await supabase
        .from('chatbots')
        .select('created_at')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      const firstDate = firstProfile?.created_at || firstChatbot?.created_at;
      if (firstDate) {
        const startYear = new Date(firstDate).getFullYear();
        const currentYear = today.getFullYear();

        for (let year = startYear; year <= currentYear; year++) {
          const date = new Date(year, 0, 1);
          date.setHours(0, 0, 0, 0);
          
          const nextDate = new Date(year + 1, 0, 1);

          const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', date.toISOString())
            .lt('created_at', nextDate.toISOString());

          const { count: chatbotCount } = await supabase
            .from('chatbots')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', date.toISOString())
            .lt('created_at', nextDate.toISOString());

          data.push({
            name: `${year}`,
            users: userCount || 0,
            chatbots: chatbotCount || 0,
          });
        }
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
