"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    title: "Product Manager at TechCorp",
    content:
      "ChatRAG transformed how we handle customer support. Setup took 5 minutes, and our response quality improved 300%.",
    avatar: "👩‍💼",
  },
  {
    name: "James Murphy",
    title: "Founder of EdTech Pro",
    content: "Finally, a tool that makes AI chatbots accessible to non-technical teams. Our training team loves it.",
    avatar: "👨‍💼",
  },
  {
    name: "Maria Garcia",
    title: "Operations Lead at StartupX",
    content:
      "The RAG implementation is seamless. No more generic responses. Our chatbot actually understands our documentation.",
    avatar: "👩‍💼",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Loved by Teams Worldwide</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our users are saying about ChatRAG.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{testimonial.avatar}</span>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
