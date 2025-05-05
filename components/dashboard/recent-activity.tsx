import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Chrome,
  Youtube,
  Globe,
  Clock,
  Gamepad2,
  Book,
  Monitor,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RecentActivity() {
  // Enhanced mock data for recent activity
  const activities = [
    {
      id: "1",
      childName: "Emma",
      childAvatar: "E",
      app: "Chrome",
      url: "wikipedia.org/wiki/solar_system",
      category: "Education",
      duration: "45 min",
      time: "10:30 AM",
      icon: Chrome,
    },
    {
      id: "2",
      childName: "Noah",
      childAvatar: "N",
      app: "YouTube",
      url: "youtube.com/watch?v=educational-content",
      category: "Education",
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
      category: "Gaming",
      duration: "1h 15min",
      time: "2:00 PM",
      icon: Gamepad2,
    },
    {
      id: "4",
      childName: "Sophia",
      childAvatar: "S",
      app: "Khan Academy",
      url: "khanacademy.org/math",
      category: "Education",
      duration: "50 min",
      time: "3:30 PM",
      icon: Book,
    },
    {
      id: "5",
      childName: "Noah",
      childAvatar: "N",
      app: "Netflix",
      url: "netflix.com/kids",
      category: "Entertainment",
      duration: "1h 10min",
      time: "4:45 PM",
      icon: Monitor,
    },
    {
      id: "6",
      childName: "Sophia",
      childAvatar: "S",
      app: "Chrome",
      url: "nationalgeographic.com/animals",
      category: "Education",
      duration: "25 min",
      time: "5:20 PM",
      icon: Chrome,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your children's recent app and website usage
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-auto">
            Today
          </Badge>
        </div>
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
                  <span className="text-xs text-muted-foreground">
                    • {activity.time}
                  </span>
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {activity.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {activity.app}
                    {activity.url && (
                      <span className="text-muted-foreground text-xs">
                        {" "}
                        - {activity.url}
                      </span>
                    )}
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
  );
}
