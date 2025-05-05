import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Chrome, Youtube, Gamepad2 } from "lucide-react"

export function UsageSummary() {
  // Mock data for app usage
  const apps = [
    { name: "Chrome", icon: Chrome, time: 45, percentage: 37.5 },
    { name: "YouTube", icon: Youtube, time: 30, percentage: 25 },
    { name: "Minecraft", icon: Gamepad2, time: 45, percentage: 37.5 },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Today's App Usage</CardTitle>
        <CardDescription>What you've been using today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {apps.map((app) => (
          <div key={app.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <app.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{app.name}</span>
              </div>
              <span className="text-sm">{app.time} min</span>
            </div>
            <Progress value={app.percentage} />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
