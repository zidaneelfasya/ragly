"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, LayoutDashboard, MessageSquare, User, LogOut } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setIsUserMenuOpen(false)
    router.push("/")
  }

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const targetElement = document.getElementById(targetId.replace('#', ''))
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    // Close mobile menu after clicking
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            {/* <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              ◆
            </div> */}
            <Image src="/images/logo-ragly.svg" alt="Logo" width={32} height={32}>

            </Image>
            ChatRAG
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, '#features')}
              className="text-foreground hover:text-primary transition cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, '#how-it-works')}
              className="text-foreground hover:text-primary transition cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleSmoothScroll(e, '#pricing')}
              className="text-foreground hover:text-primary transition cursor-pointer"
            >
              Pricing
            </a>
            <Link href="#" className="text-foreground hover:text-primary transition">
              Docs
            </Link>
          </div>

          {/* CTA Buttons or User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-accent transition"
                >
                  <Menu size={20} />
                  <span className="text-sm font-medium">Menu</span>
                </button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    {/* Backdrop to close menu when clicking outside */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition"
                      >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/chatbots"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition"
                      >
                        <MessageSquare size={18} />
                        <span>Chatbot</span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-accent transition w-full text-left text-destructive"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/authentication" className="text-foreground hover:text-primary transition">
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-opacity-90 transition font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, '#features')}
              className="block py-2 text-foreground hover:text-primary cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, '#how-it-works')}
              className="block py-2 text-foreground hover:text-primary cursor-pointer"
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => handleSmoothScroll(e, '#pricing')}
              className="block py-2 text-foreground hover:text-primary cursor-pointer"
            >
              Pricing
            </a>
            <Link href="#" className="block py-2 text-foreground hover:text-primary">
              Docs
            </Link>
            
            {/* Theme Switcher */}
            <div className="pt-4 pb-2 border-t border-border mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeSwitcher />
              </div>
            </div>
            
            {user ? (
              <div className="pt-4 flex flex-col gap-2 border-t border-border">
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-foreground hover:text-primary"
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/dashboard/chatbots" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-foreground hover:text-primary"
                >
                  <MessageSquare size={18} />
                  <span>Chatbot</span>
                </Link>
                <Link 
                  href="/dashboard/profile" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 text-foreground hover:text-primary"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2 text-destructive hover:text-destructive/80 text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <Link href="/auth/authentication" className="text-center py-2 text-foreground hover:text-primary">
                  Sign In
                </Link>
                <Link
                  href="/auth/authentication"
                  className="text-center py-2 bg-primary text-primary-foreground rounded-full hover:bg-opacity-90 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
