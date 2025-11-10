import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function Header() {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back! Here's your chatbot activity summary.</p>
      </div>
      <Button className="gap-2 bg-primary hover:bg-primary/90">
        <Plus className="h-4 w-4" />
        Create Chatbot
      </Button>
    </div>
  )
}
