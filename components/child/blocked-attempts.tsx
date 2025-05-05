import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export function BlockedAttempts() {
  // Mock data for blocked attempts
  const blockedAttempts = [
    { site: "facebook.com", time: "10:15 AM", reason: "Social Media" },
    { site: "instagram.com", time: "11:30 AM", reason: "Social Media" },
    { site: "games.example.com", time: "2:45 PM", reason: "Gaming" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Attempts</CardTitle>
        <CardDescription>Sites that were blocked today</CardDescription>
      </CardHeader>
      <CardContent>
        {blockedAttempts.length > 0 ? (
          <div className="space-y-4">
            {blockedAttempts.map((attempt, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-1">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">{attempt.site}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>{attempt.time}</span>
                    <span>•</span>
                    <span>Reason: {attempt.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No blocked attempts today.</p>
        )}
      </CardContent>
    </Card>
  )
}
