import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, Globe, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AlertsList() {
  // Mock data for alerts
  const alerts = [
    {
      id: "1",
      child: "Emma",
      message: "Daily screen time limit reached",
      time: "Today, 3:45 PM",
      type: "limit",
      read: false,
    },
    {
      id: "2",
      child: "Noah",
      message: "Attempted to access blocked site (facebook.com)",
      time: "Today, 2:30 PM",
      type: "block",
      read: false,
    },
    {
      id: "3",
      child: "Emma",
      message: "Unusual activity detected - 10 apps opened in 5 minutes",
      time: "Yesterday, 7:15 PM",
      type: "unusual",
      read: true,
    },
    {
      id: "4",
      child: "Noah",
      message: "Bedtime mode activated",
      time: "Yesterday, 9:00 PM",
      type: "bedtime",
      read: true,
    },
  ]

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-4 p-3 rounded-lg ${alert.read ? "bg-background" : "bg-muted"}`}
          >
            <div className="rounded-full p-1.5 bg-background">
              {alert.type === "limit" && <Clock className="h-4 w-4 text-amber-500" />}
              {alert.type === "block" && <AlertCircle className="h-4 w-4 text-destructive" />}
              {alert.type === "unusual" && <Globe className="h-4 w-4 text-blue-500" />}
              {alert.type === "bedtime" && <Clock className="h-4 w-4 text-indigo-500" />}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{alert.child}</span>
                {!alert.read && (
                  <Badge variant="outline" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm">{alert.message}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
            {!alert.read && (
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Check className="h-4 w-4" />
                <span className="sr-only">Mark as read</span>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
