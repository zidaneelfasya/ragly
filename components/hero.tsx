"use client"

import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit mb-4 px-4 py-2 bg-accent/10 border border-accent rounded-full">
              <span className="text-accent text-sm font-medium">Build AI-Powered Chatbots</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground mb-6">
              Build Your Own <span className="text-primary">AI Chatbot</span> with Real Knowledge
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Create intelligent chatbots powered by RAG technology. Connect your knowledge base, train instantly, and
              deploy with a single click. No code required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
              >
                Get Started Free <ArrowRight size={20} />
              </Link>
              <Link
                href="#"
                className="px-8 py-3 border border-border rounded-full font-semibold hover:bg-muted transition flex items-center justify-center gap-2"
              >
                <Play size={20} /> View Demo
              </Link>
            </div>
          </div>

          {/* Right - Interactive Preview */}
          <div className="relative h-96 md:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <div className="relative glass-effect rounded-2xl p-8 h-full flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 max-w-xs">
                  <p className="text-sm text-foreground">How does RAG technology work?</p>
                </div>

                <div className="ml-auto bg-primary/20 rounded-lg p-4 max-w-xs">
                  <p className="text-sm text-primary">
                    RAG retrieves relevant information from your knowledge base before generating responses, ensuring
                    accurate and contextual answers.
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-4 max-w-xs">
                  <p className="text-sm text-foreground">Can I customize responses?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
