"use client"

import Link from "next/link"
import { ArrowRight, Play } from "lucide-react"
import ChatPreview from "./chat-preview"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-block w-fit mb-4 px-4 py-2 bg-accent/10 border border-accent rounded-full">
              <span className="text- text-sm font-medium">Build AI-Powered Chatbots</span>
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
          <div className="relative h-96 md:h-full min-h-96 flex items-center justify-center">
            <ChatPreview />
          </div>
        </div>
      </div>
    </section>
  )
}
