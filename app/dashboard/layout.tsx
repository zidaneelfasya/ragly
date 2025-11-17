import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Bot, User, Settings, LayoutDashboard } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarToggle } from '@/components/dashboard/responsive-sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Hanya kirim data string ke client component


  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <Sidebar user={user} />
        
        {/* Main content */}
        <main className="transition-all duration-300 lg:ml-64">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 lg:hidden border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                <span className="font-bold text-foreground">Ragly</span>
              </Link>
              <SidebarToggle />
            </div>
          </div>
          
          {/* Desktop toggle button */}
          <div className="hidden lg:block fixed top-4 left-4 z-50 sidebar-toggle-desktop">
            <SidebarToggle />
          </div>
          
          <div className="p-4 lg:p-6 lg:pt-16">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}