"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Sparkles, Zap, Shield, Globe, Code, Cpu } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "RAG Technology",
    description: "Advanced Retrieval-Augmented Generation ensures accurate, contextual responses from your knowledge base",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-2-second response times powered by optimized AI infrastructure and edge computing",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and complete data privacy for your peace of mind",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Support for 50+ languages with automatic detection and translation capabilities",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Code,
    title: "Easy Integration",
    description: "One-click embed, REST API, SDKs, and webhooks for seamless platform integration",
    gradient: "from-red-500 to-orange-500"
  },
  {
    icon: Cpu,
    title: "Smart Learning",
    description: "Continuously improves from interactions, getting smarter with every conversation",
    gradient: "from-indigo-500 to-purple-500"
  }
]

export default function FeaturesModern() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden" id="features">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Everything You Need
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary">
              Out of the Box
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Cutting-edge AI technology meets intuitive design. Build, deploy, and scale 
            intelligent chatbots without any technical expertise.
          </p>
        </motion.div>

        {/* Features Grid - Asymmetric Layout */}
        <div className="max-w-7xl mx-auto">
          {/* First Row - 2 cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {features.slice(0, 2).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                  {/* Hover Effect Line */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second Row - 3 cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {features.slice(2, 5).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: (index + 2) * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-8 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Third Row - 1 large card */}
          <div className="grid md:grid-cols-1 gap-8">
            {features.slice(5, 6).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 5 * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full p-8 md:p-12 rounded-3xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                        <feature.icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>

                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
