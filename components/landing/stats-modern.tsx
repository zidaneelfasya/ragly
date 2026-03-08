"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { TrendingUp, Zap, Users, Bot, MessageSquare, Target } from "lucide-react"
import { CounterStat } from "@/components/counter-stat"

const stats = [
  {
    icon: Target,
    value: "98.5%",
    label: "Accuracy Rate",
    description: "Precise answers powered by advanced RAG",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    value: "<2s",
    label: "Response Time",
    description: "Lightning-fast AI responses",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    description: "Trusted by businesses worldwide",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Bot,
    value: "25K+",
    label: "Chatbots Created",
    description: "Deployed across industries",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: MessageSquare,
    value: "2M+",
    label: "Conversations",
    description: "Messages handled successfully",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime SLA",
    description: "Always available for your customers",
    color: "from-red-500 to-pink-500"
  }
]

export default function StatsModern() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 backdrop-blur-sm mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Proven Performance</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Built for
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary">
              Excellence
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Numbers that speak for themselves. Our platform delivers exceptional results.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>

                {/* Value */}
                <div className={`text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br ${stat.color}`}>
                  <CounterStat value={stat.value} />
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-muted-foreground mb-6">
            Join thousands of businesses transforming their customer experience
          </p>
          <div className="flex justify-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold"
                >
                  {i}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-background bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                +50K
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
