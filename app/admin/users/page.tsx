import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminUsersManagement } from '@/components/admin/admin-users-management';

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    return redirect('/admin/no-access');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
        <p className="text-muted-foreground">
          Kelola pengguna dan role mereka di platform
        </p>
      </div>

      <AdminUsersManagement />
    </div>
  );
}
