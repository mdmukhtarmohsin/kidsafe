"use client";

import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAlerts } from "./alerts-context";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function AlertsHeader() {
  const { unreadCount, markAllAsRead, isLoading } = useAlerts();
  const [isMarking, setIsMarking] = useState(false);
  const { toast } = useToast();

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      setIsMarking(true);
      await markAllAsRead();
      toast({
        title: "Success",
        description: "All alerts have been marked as read",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to mark alerts as read",
        variant: "destructive",
      });
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Alerts</h1>
          {!isLoading && unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Monitor and manage notifications about your children's activities
        </p>
      </div>
      <div className="flex gap-2">
        {/* {isLoading ? (
          <Skeleton className="h-10 w-[140px]" />
        ) : unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarking}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isMarking ? "Marking..." : "Mark all as read"}
          </Button>
        ) : null} */}
      </div>
    </div>
  );
}
