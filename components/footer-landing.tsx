"use client"

import Link from "next/link"
import Image from "next/image"
import { Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react"

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Security", href: "#" },
]

const socials = [
  { label: "GitHub", href: "#", icon: Github },
  { label: "Twitter / X", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-border overflow-hidden bg-background">

      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-24 items-start">

          {/* Left — Brand + tagline + CTA */}
          <div className="space-y-6 max-w-md">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/images/logo-ragly.svg"
                alt="Ragly"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-foreground tracking-tight">Ragly</span>
            </Link>

            <p className="text-muted-foreground text-base leading-relaxed">
              Build intelligent AI chatbots powered by your own knowledge base.
              Deploy in minutes, scale without limits.
            </p>

            {/* CTA */}
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200 group"
            >
              Start building for free
              <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>

          {/* Right — Nav columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16 text-sm">
            {/* Product */}
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Product</p>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-foreground/70 hover:text-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Legal</p>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-foreground/70 hover:text-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Follow Us</p>
              <ul className="space-y-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors duration-150"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Large display wordmark — decorative background element */}
      <div className="relative select-none overflow-hidden">
        <p
          aria-hidden="true"
          className="text-[22vw] font-black leading-none tracking-tighter text-foreground/[0.04] dark:text-foreground/[0.06] whitespace-nowrap pointer-events-none px-4"
        >
          RAGLY
        </p>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ragly. All rights reserved.
          </p>
          {/* <p className="text-xs text-muted-foreground">
            Built with ❤️ for developers
          </p> */}
        </div>
      </div>
    </footer>
  )
}
