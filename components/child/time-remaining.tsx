import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

export function TimeRemaining() {
  // Mock data for time remaining
  const timeUsed = 120 // minutes
  const dailyLimit = 180 // minutes
  const timeRemaining = dailyLimit - timeUsed
  const percentageUsed = (timeUsed / dailyLimit) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Remaining Today
        </CardTitle>
        <CardDescription>
          You have used {Math.floor(timeUsed / 60)}h {timeUsed % 60}m of your daily limit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground">hours remaining</div>
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={percentageUsed} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>0h</div>
            <div>{Math.floor(dailyLimit / 60)}h</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
