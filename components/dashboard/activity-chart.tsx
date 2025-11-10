import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Mon", interactions: 240 },
  { day: "Tue", interactions: 320 },
  { day: "Wed", interactions: 280 },
  { day: "Thu", interactions: 390 },
  { day: "Fri", interactions: 450 },
  { day: "Sat", interactions: 520 },
  { day: "Sun", interactions: 610 },
]

export function ActivityChart() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Chatbot Activity</h2>
        <p className="text-sm text-muted-foreground">Interactions per day (Last 7 days)</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
          <YAxis stroke="var(--color-muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: `1px solid var(--color-border)`,
              borderRadius: "0.5rem",
            }}
            labelStyle={{ color: "var(--color-foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="interactions"
            stroke="var(--color-primary)"
            dot={{ fill: "var(--color-primary)" }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
