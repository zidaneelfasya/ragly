import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

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

    // Get recent users (last 5)
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('id, full_name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent chatbots (last 5)
    const { data: recentChatbots } = await supabase
      .from('chatbots')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Combine and sort by created_at
    const activities = [
      ...(recentUsers?.map((u) => ({
        id: u.id,
        type: 'user' as const,
        name: u.full_name || u.email || 'Unknown User',
        email: u.email,
        created_at: u.created_at,
      })) || []),
      ...(recentChatbots?.map((c) => ({
        id: c.id,
        type: 'chatbot' as const,
        name: c.name,
        created_at: c.created_at,
      })) || []),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
