"use client"

import { Header } from "@/components/dashboard/header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { ActivityChart } from "@/components/dashboard/activity-chart"
import { ChatbotsList } from "@/components/dashboard/chatbots-list"
import { SubscriptionStatus } from "@/components/dashboard/subscription-status"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                ℭ
              </div>
              <span className="text-lg font-semibold text-foreground">ChatBot Pro</span>
            </div>
            <div className="text-sm text-muted-foreground">Workspace</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header />
        <SubscriptionStatus />
        <StatsOverview />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityChart />
          </div>
          <div>
            <ChatbotsList />
          </div>
        </div>
      </main>
    </div>
  )
}
