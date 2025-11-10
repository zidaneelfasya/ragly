import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"

export function SubscriptionStatus() {
  return (
    <Card className="mb-8 border-accent/50 bg-accent/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-foreground">Free Plan</p>
            <p className="text-sm text-muted-foreground">Upgrade to Pro for unlimited chatbots and advanced features</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Upgrade
        </Button>
      </div>
    </Card>
  )
}
