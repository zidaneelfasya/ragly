import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Bot, FileText, Activity, TrendingUp, Calendar } from 'lucide-react';
import { AdminStatsCharts } from '@/components/admin/admin-stats-charts';
import { RecentActivity } from '@/components/admin/recent-activity';
import { createClient as createServiceClient } from '@supabase/supabase-js';

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }


  // Use service role client to bypass RLS
  const supabaseAdmin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

 
  
  if (profileError) {
    console.error('[Admin Dashboard] Error fetching profile:', profileError);
  }
    
  if (!profile || profile.role !== 'admin') {
    console.log('[Admin Dashboard] Access denied. Redirecting to no-access page.');
    return redirect('/admin/no-access');
  }

  console.log('[Admin Dashboard] ✓ Admin access granted');

  // Fetch statistics (use admin client to bypass RLS)
  const { count: totalUsers } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalChatbots } = await supabaseAdmin
    .from('chatbots')
    .select('*', { count: 'exact', head: true });

  const { count: activeChatbots } = await supabaseAdmin
    .from('chatbots')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: totalFiles } = await supabaseAdmin
    .from('chatbot_rag_files')
    .select('*', { count: 'exact', head: true });

  // Get users created in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { count: newUsersLast30Days } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Get chatbots created in last 30 days
  const { count: newChatbotsLast30Days } = await supabaseAdmin
    .from('chatbots')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  const stats = [
    {
      title: 'Total Pengguna',
      value: totalUsers || 0,
      icon: Users,
      description: `+${newUsersLast30Days || 0} dalam 30 hari terakhir`,
      trend: 'up',
    },
    {
      title: 'Total Chatbot',
      value: totalChatbots || 0,
      icon: Bot,
      description: `${activeChatbots || 0} aktif`,
      trend: 'up',
    },
    {
      title: 'Chatbot Baru',
      value: newChatbotsLast30Days || 0,
      icon: Activity,
      description: 'Dalam 30 hari terakhir',
      trend: 'up',
    },
    {
      title: 'Total File RAG',
      value: totalFiles || 0,
      icon: FileText,
      description: 'Knowledge base files',
      trend: 'neutral',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Overview statistik dan penggunaan platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <AdminStatsCharts />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
