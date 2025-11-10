"use client"

import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Upload Files",
    description: "Add your knowledge base using PDF, DOCX, or TXT files. Multiple files supported.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Train Chatbot",
    description: "Our RAG engine processes and indexes your documents for intelligent retrieval.",
    color: "from-purple-500 to-blue-500",
  },
  {
    number: "03",
    title: "Chat Instantly",
    description: "Start chatting with your AI immediately. Deploy and share with users in seconds.",
    color: "from-pink-500 to-purple-500",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, intuitive process to get your AI chatbot running in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-background border border-border hover:border-primary/50 transition-all">
                <div className={`text-5xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 text-primary">
                  <ArrowRight size={32} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
