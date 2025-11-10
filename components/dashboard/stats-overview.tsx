import { Card } from "@/components/ui/card"
import { MessageSquare, Zap, Upload, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Active Chatbots",
    value: "3",
    change: "+1 this month",
    icon: MessageSquare,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Queries This Month",
    value: "2,847",
    change: "+12% from last month",
    icon: TrendingUp,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    label: "Tokens Used",
    value: "542K",
    change: "68% of monthly limit",
    icon: Zap,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "Files Uploaded",
    value: "127",
    change: "2.4 GB total size",
    icon: Upload,
    color: "bg-slate-100 text-slate-600",
  },
]

export function StatsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-2 text-xs text-muted-foreground">{stat.change}</p>
              </div>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
