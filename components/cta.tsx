"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Build Your AI Chatbot?</h2>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Join thousands of teams using ChatRAG to deliver better customer experiences. Start building today—no credit
          card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-opacity-90 transition flex items-center justify-center gap-2"
          >
            Start Building Now <ArrowRight size={20} />
          </Link>
          <Link
            href="#"
            className="px-8 py-4 border border-border rounded-full font-semibold hover:bg-muted transition"
          >
            Schedule a Demo
          </Link>
        </div>
      </div>
    </section>
  )
}
