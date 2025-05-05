import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UsageStatsProps {
  id: string
}

export function UsageStats({ id }: UsageStatsProps) {
  // Mock data for usage stats
  const stats = {
    today: {
      timeUsed: 120,
      dailyLimit: 180,
      topApps: [
        { name: "Chrome", time: 45, percentage: 37.5 },
        { name: "YouTube", time: 30, percentage: 25 },
        { name: "Minecraft", time: 45, percentage: 37.5 },
      ],
    },
    week: {
      timeUsed: 840,
      dailyLimit: 1260,
      topApps: [
        { name: "Chrome", time: 300, percentage: 35.7 },
        { name: "YouTube", time: 240, percentage: 28.6 },
        { name: "Minecraft", time: 300, percentage: 35.7 },
      ],
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>Monitor your child's screen time and app usage</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Screen Time</span>
                <span className="font-medium">
                  {Math.floor(stats.today.timeUsed / 60)}h {stats.today.timeUsed % 60}m /{" "}
                  {Math.floor(stats.today.dailyLimit / 60)}h {stats.today.dailyLimit % 60}m
                </span>
              </div>
              <Progress value={(stats.today.timeUsed / stats.today.dailyLimit) * 100} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Top Apps</h4>
              {stats.today.topApps.map((app) => (
                <div key={app.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{app.name}</span>
                    <span>
                      {app.time} min ({app.percentage}%)
                    </span>
                  </div>
                  <Progress value={app.percentage} />
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="week" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Screen Time</span>
                <span className="font-medium">
                  {Math.floor(stats.week.timeUsed / 60)}h {stats.week.timeUsed % 60}m /{" "}
                  {Math.floor(stats.week.dailyLimit / 60)}h {stats.week.dailyLimit % 60}m
                </span>
              </div>
              <Progress value={(stats.week.timeUsed / stats.week.dailyLimit) * 100} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Top Apps</h4>
              {stats.week.topApps.map((app) => (
                <div key={app.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{app.name}</span>
                    <span>
                      {app.time} min ({app.percentage}%)
                    </span>
                  </div>
                  <Progress value={app.percentage} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
