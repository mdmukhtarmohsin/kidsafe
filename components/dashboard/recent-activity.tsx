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
import { cn } from "@/lib/utils";

export function RecentActivity() {
  // Enhanced mock data for recent activity
  const activities = [
    {
      id: "1",
      childName: "Emma",
      childAvatar: "E",
      avatarColor: "bg-pink-500",
      app: "Chrome",
      url: "wikipedia.org/wiki/solar_system",
      category: "Education",
      categoryColor: "bg-blue-100 text-blue-800",
      duration: "45 min",
      time: "10:30 AM",
      icon: Chrome,
      iconColor: "text-blue-500",
    },
    {
      id: "2",
      childName: "Noah",
      childAvatar: "N",
      avatarColor: "bg-purple-500",
      app: "YouTube",
      url: "youtube.com/watch?v=educational-content",
      category: "Education",
      categoryColor: "bg-blue-100 text-blue-800",
      duration: "30 min",
      time: "11:15 AM",
      icon: Youtube,
      iconColor: "text-red-500",
    },
    {
      id: "3",
      childName: "Emma",
      childAvatar: "E",
      avatarColor: "bg-pink-500",
      app: "Minecraft",
      url: null,
      category: "Gaming",
      categoryColor: "bg-green-100 text-green-800",
      duration: "1h 15min",
      time: "2:00 PM",
      icon: Gamepad2,
      iconColor: "text-green-500",
    },
    {
      id: "4",
      childName: "Sophia",
      childAvatar: "S",
      avatarColor: "bg-yellow-500",
      app: "Khan Academy",
      url: "khanacademy.org/math",
      category: "Education",
      categoryColor: "bg-blue-100 text-blue-800",
      duration: "50 min",
      time: "3:30 PM",
      icon: Book,
      iconColor: "text-blue-500",
    },
    {
      id: "5",
      childName: "Noah",
      childAvatar: "N",
      avatarColor: "bg-purple-500",
      app: "Netflix",
      url: "netflix.com/kids",
      category: "Entertainment",
      categoryColor: "bg-red-100 text-red-800",
      duration: "1h 10min",
      time: "4:45 PM",
      icon: Monitor,
      iconColor: "text-red-500",
    },
    {
      id: "6",
      childName: "Sophia",
      childAvatar: "S",
      avatarColor: "bg-yellow-500",
      app: "Chrome",
      url: "nationalgeographic.com/animals",
      category: "Education",
      categoryColor: "bg-blue-100 text-blue-800",
      duration: "25 min",
      time: "5:20 PM",
      icon: Chrome,
      iconColor: "text-blue-500",
    },
  ];

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-indigo-700">Recent Activity</CardTitle>
            <CardDescription>
              Your children's recent app and website usage
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="ml-auto bg-indigo-100 text-indigo-800"
          >
            Today
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Avatar className="h-9 w-9">
                <AvatarFallback>{activity.childAvatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.childName}</p>
                  <span className="text-xs text-muted-foreground">
                    • {activity.time}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs px-1.5 py-0.5",
                      activity.categoryColor
                    )}
                  >
                    {activity.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <activity.icon
                    className={cn("h-4 w-4", activity.iconColor)}
                  />
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
              <div className="flex items-center gap-1 text-muted-foreground bg-gray-100 px-2 py-1 rounded-full">
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
