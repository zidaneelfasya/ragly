import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

const chatbots = [
  {
    id: 1,
    name: "Customer Support Bot",
    status: "active",
    queries: "1,240",
    created: "2 weeks ago",
  },
  {
    id: 2,
    name: "Product Assistant",
    status: "active",
    queries: "892",
    created: "1 week ago",
  },
  {
    id: 3,
    name: "FAQ Helper",
    status: "inactive",
    queries: "715",
    created: "3 days ago",
  },
]

export function ChatbotsList() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Recent Chatbots</h2>
      </div>
      <div className="space-y-4">
        {chatbots.map((bot) => (
          <div
            key={bot.id}
            className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{bot.name}</p>
              <p className="text-xs text-muted-foreground">
                {bot.queries} queries • {bot.created}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={bot.status === "active" ? "default" : "secondary"}>{bot.status}</Badge>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
