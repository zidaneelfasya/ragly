'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Bot, User, Menu, X, LayoutDashboard, Settings } from 'lucide-react';

// Sidebar Context
const SidebarContext = createContext<{
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}>({
  isOpen: false,
  toggle: () => {},
  close: () => {},
});

// Types
interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

interface SidebarProps {
  user: any;
  navItems: NavItem[];
}

// Sidebar Provider Component
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we're on desktop and load saved preference
  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      
      if (desktop) {
        // Load saved preference from localStorage for desktop
        const savedState = localStorage.getItem('sidebar-open');
        if (savedState !== null) {
          setIsOpen(savedState === 'true');
        } else {
          setIsOpen(true); // Default to open on desktop
        }
      } else {
        setIsOpen(false); // Default to closed on mobile
      }
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev: boolean) => {
      const newState = !prev;
      // Save preference only on desktop
      if (window.innerWidth >= 1024) {
        localStorage.setItem('sidebar-open', newState.toString());
      }
      return newState;
    });
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Don't save close state to localStorage as it should only apply to current session on mobile
  }, []);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (window.innerWidth < 1024 && isOpen && !target.closest('aside') && !target.closest('button')) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, close]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, close]);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      <div className={isOpen ? 'sidebar-open' : 'sidebar-collapsed'}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// Sidebar Component
export function Sidebar({ user }: { user: any }) {
  const { isOpen, close } = useContext(SidebarContext);

  // Definisikan navItems di client component
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Chatbots', href: '/dashboard/chatbots', icon: Bot },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];
  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      close();
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sidebar-collapsed:-translate-x-full
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={handleNavClick}>
              <Bot className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold text-foreground">Ragly</span>
            </Link>
            
            {/* Close button for mobile */}
            <button
              onClick={close}
              className="lg:hidden p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* User info */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Sidebar Toggle Button
export function SidebarToggle() {
  const { isOpen, toggle } = useContext(SidebarContext);

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      <div className="relative">
        {isOpen ? (
          <X className="h-4 w-4 transition-transform duration-200" />
        ) : (
          <Menu className="h-4 w-4 transition-transform duration-200" />
        )}
      </div>
    </button>
  );
}
