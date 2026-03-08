"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out our platform",
    features: [
      "1 Chatbot",
      "1,000 messages/month",
      "Basic analytics",
      "Email support",
      "Standard response time",
      "Community access"
    ],
    cta: "Get Started",
    highlighted: false,
    gradient: "from-gray-500 to-gray-600"
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing businesses",
    features: [
      "5 Chatbots",
      "50,000 messages/month",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
      "Integrations",
      "Multi-language support"
    ],
    cta: "Start Free Trial",
    highlighted: true,
    gradient: "from-primary to-secondary"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Unlimited chatbots",
      "Unlimited messages",
      "Enterprise analytics",
      "24/7 dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "White-label solution",
      "On-premise deployment",
      "Training & onboarding"
    ],
    cta: "Contact Sales",
    highlighted: false,
    gradient: "from-purple-500 to-pink-500"
  }
]

export default function PricingModern() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Simple,
            </span>
            {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary">
              Transparent
            </span>
            {" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your business. Scale as you grow.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative ${plan.highlighted ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Highlighted Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className={`px-4 py-1 rounded-full bg-gradient-to-r ${plan.gradient} text-white text-sm font-medium shadow-lg`}>
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`relative h-full p-8 rounded-3xl bg-card/50 backdrop-blur-sm border-2 ${
                plan.highlighted ? "border-primary shadow-2xl shadow-primary/20" : "border-border/50"
              } hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                {/* Gradient Background */}
                {plan.highlighted && (
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${plan.gradient} opacity-5`} />
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="flex items-end justify-center gap-1">
                    <span className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${plan.gradient}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground mb-2">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${plan.gradient} p-0.5 flex-shrink-0 mt-0.5`}>
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href="/dashboard" className="block">
                  <Button
                    className={`w-full gap-2 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 text-sm text-muted-foreground"
        >
          All plans include 14-day free trial • No credit card required • Cancel anytime
        </motion.div>
      </div>
    </section>
  )
}
