"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              ◆
            </div>
            ChatRAG
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-foreground hover:text-primary transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-foreground hover:text-primary transition">
              How It Works
            </Link>
            <Link href="#pricing" className="text-foreground hover:text-primary transition">
              Pricing
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition">
              Docs
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-foreground hover:text-primary transition">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-opacity-90 transition font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link href="#features" className="block py-2 text-foreground hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="block py-2 text-foreground hover:text-primary">
              How It Works
            </Link>
            <Link href="#pricing" className="block py-2 text-foreground hover:text-primary">
              Pricing
            </Link>
            <Link href="#" className="block py-2 text-foreground hover:text-primary">
              Docs
            </Link>
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/login" className="text-center py-2 text-foreground hover:text-primary">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-center py-2 bg-primary text-primary-foreground rounded-full hover:bg-opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
