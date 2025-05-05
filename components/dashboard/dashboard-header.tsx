import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function DashboardHeader() {
  // Mock user data
  const user = {
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: null,
    unreadAlerts: 3,
  };

  // Current date formatted nicely
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant="outline" className="text-xs">
            {today}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Monitor your children's device usage and internet activity
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/alerts">
            <Bell className="h-4 w-4" />
            {user.unreadAlerts > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            )}
            <span className="sr-only">Alerts</span>
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2 border rounded-md p-2">
          <Avatar className="h-8 w-8">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
