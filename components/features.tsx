"use client"

import { Zap, Upload, Settings, Cpu, Lock, Gauge } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Drag-and-Drop Builder",
    description: "Create chatbots without coding. Intuitive interface makes it easy for anyone to get started.",
  },
  {
    icon: Upload,
    title: "Connect Knowledge Base",
    description: "Upload PDF, DOCX, TXT files. Your chatbot learns from your documents instantly.",
  },
  {
    icon: Settings,
    title: "Custom Commands & Responses",
    description: "Define specific behaviors and responses for different user queries and scenarios.",
  },
  {
    icon: Gauge,
    title: "Realtime Testing",
    description: "Test your chatbot in real-time before deployment. Iterate and improve instantly.",
  },
  {
    icon: Lock,
    title: "Secure Authentication",
    description: "Enterprise-grade security with Supabase. Your data is always protected.",
  },
  {
    icon: Cpu,
    title: "One-Click Deployment",
    description: "Deploy your chatbot with a single click. Available on web and mobile instantly.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Powerful Features for Modern AI</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build, test, and deploy intelligent chatbots powered by RAG technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
