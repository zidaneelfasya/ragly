"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                ◆
              </div>
              ChatRAG
            </Link>
            <p className="text-muted-foreground text-sm">
              Build intelligent AI chatbots with retrieval-augmented generation technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <div className="space-y-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Features
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Pricing
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Documentation
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                API Reference
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <div className="space-y-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Blog
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Guides
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Support
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Community
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <div className="space-y-2">
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Security
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">© 2025 ChatRAG. All rights reserved.</p>

          {/* Social Links */}
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition" aria-label="GitHub">
              <Github size={20} />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition" aria-label="Twitter">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition" aria-label="LinkedIn">
              <Linkedin size={20} />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition" aria-label="Email">
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
