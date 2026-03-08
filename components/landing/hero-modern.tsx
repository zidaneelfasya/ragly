"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Zap, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { CounterStat } from "@/components/counter-stat"

export default function HeroModern() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background py-40">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-60" />

      {/* Radial Vignette Overlay - Fokus pada Image */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_30%,hsl(var(--background))_70%)] pointer-events-none z-0" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Centered Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 mb-16"
          >
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-tight">
              AI for Smart Chatbots
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Make smarter decisions with your data
            </p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="pt-4"
            >
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="font-medium px-8 py-6 text-base rounded-md shadow-lg"
                >
                  Get a demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>

            
          </motion.div>

          {/* Large Preview Image */}
          <motion.div
            key={resolvedTheme} // Re-animate when theme changes
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Main Image Container */}
            <div className="relative rounded-lg overflow-hidden ">
              <Image
                src={mounted && resolvedTheme === "dark" ? "/landing/hero-dark.png" : "/landing/hero-light.png"}
                alt="Chatbot Dashboard Preview"
                width={1400}
                height={900}
                className="w-full h-auto"
                priority
              />
              
              {/* Bottom Overlay - Covers 1/4 of image with gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-background/100 via-background/50 to-transparent pointer-events-none" />
            </div>

            {/* Glow Effect Behind Image */}
            {/* <div className="absolute -inset-x-20 -inset-y-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-30 -z-10" /> */}
          </motion.div>
          {/* Stats Grid - Compelling Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto pt-8 mt-12"
            >
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <CounterStat value="98.5%" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Akurasi Jawaban
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <CounterStat value="<2s" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Kecepatan Respon
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <CounterStat value="50K+" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Pengguna Aktif
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <CounterStat value="10K+" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Chatbot Dibuat
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <CounterStat value="2M+" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Percakapan
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  <CounterStat value="99.9%" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Uptime
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span>24/7 Support</span>
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
