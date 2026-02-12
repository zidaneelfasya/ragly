import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Admin Panel - Ragly",
  description:
    "Admin dashboard untuk mengelola pengguna dan statistik platform Ragly",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Check if user is admin
  console.log('[Admin Layout] Checking admin role for user:', user.email);
  console.log('[Admin Layout] User ID:', user.id);

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
    .select('role, full_name, email')
    .eq('user_id', user.id)
    .single();

  console.log('[Admin Layout] Profile data:', profile);
  console.log('[Admin Layout] Profile role:', profile?.role);

  if (profileError) {
    console.error('[Admin Layout] Error fetching profile:', profileError);
  }

  if (!profile || profile.role !== 'admin') {
    console.log('[Admin Layout] Access denied. Redirecting to no-access page.');
    return redirect('/admin/no-access');
  }

  console.log('[Admin Layout] ✓ Admin access granted');

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Pengguna',
      href: '/admin/users',
      icon: Users,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card shadow-sm">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex h-16 items-center gap-2 border-b px-6 bg-card">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h2 className="font-bold text-foreground">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Ragly</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* User Info */}
            <div className="border-t p-4 bg-card">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {profile.full_name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {profile.full_name || profile.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 min-h-screen bg-background">
          <div className="mx-auto max-w-6xl px-8 py-8">
            {children}
          </div>
        </main>
      </div>
      <Analytics />
    </>
  )
}
