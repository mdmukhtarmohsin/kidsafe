import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Chrome, Youtube, Globe, Clock } from "lucide-react"

export function RecentActivity() {
  // Mock data for recent activity
  const activities = [
    {
      id: "1",
      childName: "Emma",
      childAvatar: "E",
      app: "Chrome",
      url: "wikipedia.org",
      duration: "45 min",
      time: "10:30 AM",
      icon: Chrome,
    },
    {
      id: "2",
      childName: "Noah",
      childAvatar: "N",
      app: "YouTube",
      url: "youtube.com/educational",
      duration: "30 min",
      time: "11:15 AM",
      icon: Youtube,
    },
    {
      id: "3",
      childName: "Emma",
      childAvatar: "E",
      app: "Minecraft",
      url: null,
      duration: "1h 15min",
      time: "2:00 PM",
      icon: Globe,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your children's recent app and website usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{activity.childAvatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.childName}</p>
                  <span className="text-xs text-muted-foreground">• {activity.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {activity.app}
                    {activity.url && <span className="text-muted-foreground"> - {activity.url}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{activity.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
