"use client"

import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "Forever free",
    description: "Perfect for getting started",
    features: [
      "Up to 2 chatbots",
      "10,000 messages/month",
      "Basic file uploads (PDF, TXT)",
      "Community support",
      "Standard response time",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    period: "Per month",
    description: "For growing businesses",
    features: [
      "Unlimited chatbots",
      "100,000 messages/month",
      "All file formats (PDF, DOCX, TXT, etc.)",
      "Email support",
      "Custom branding",
      "Advanced analytics",
      "Faster response times",
    ],
    popular: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Contact us",
    description: "For large organizations",
    features: [
      "Custom message limits",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Priority deployment",
      "Advanced security features",
      "API access",
    ],
    popular: false,
    cta: "Contact Sales",
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Always fair pricing, no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border transition-all ${
                plan.popular
                  ? "md:scale-105 bg-primary/5 border-primary"
                  : "bg-background border-border hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>

                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-lg font-semibold transition mb-8 ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-opacity-90"
                      : "border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {plan.cta}
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
