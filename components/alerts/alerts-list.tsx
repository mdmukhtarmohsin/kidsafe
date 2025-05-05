"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Bell,
  Clock,
  AlertTriangle,
  Shield,
  MapPin,
  CheckCircle,
  Smartphone,
  EyeOff,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAlerts } from "./alerts-context";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AlertsList() {
  const { alerts, unreadCount, markAsRead, markAllAsRead, isLoading, error } =
    useAlerts();
  const [isMarking, setIsMarking] = useState(false);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading alerts</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarking(true);
      await markAllAsRead();
    } catch (err) {
      console.error("Failed to mark alerts as read:", err);
    } finally {
      setIsMarking(false);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAsRead(alertId);
    } catch (err) {
      console.error(`Failed to mark alert ${alertId} as read:`, err);
    }
  };

  // Get icon based on alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "inappropriate_content":
        return <Shield className="h-5 w-5 text-red-500" />;
      case "time_limit":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "unknown_app":
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      case "bedtime":
        return <EyeOff className="h-5 w-5 text-indigo-500" />;
      case "location":
        return <MapPin className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Recent Alerts
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Notifications about your children's activities
          </CardDescription>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarking}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isMarking ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No alerts to display
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${
                    !alert.read
                      ? "bg-primary/5 dark:bg-primary/10"
                      : "bg-background"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p
                        className={`font-medium ${
                          !alert.read ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {alert.message}
                      </p>
                      {alert.urgent && (
                        <Badge variant="destructive" className="ml-2 h-fit">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0"
                      onClick={() => handleMarkAsRead(alert.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          {alerts.length > 0
            ? `Showing ${alerts.length} alerts`
            : "No alerts to display"}
        </p>
      </CardFooter>
    </Card>
  );
}
