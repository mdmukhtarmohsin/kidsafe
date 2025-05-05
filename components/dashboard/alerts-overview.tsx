"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ShieldAlert, AlertCircle, Activity } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import type { Tables } from "@/lib/supabase-types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert as UiAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Define the type for an alert
type AlertData = Tables<"alerts">;

export function AlertsOverview() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Get the current user session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!sessionData.session) throw new Error("Not authenticated");

        const userId = sessionData.session.user.id;

        // 2. Fetch recent unread alerts for the logged-in parent
        const { data: alertsData, error: alertsError } = await supabase
          .from("alerts")
          .select("*", { count: "exact" }) // Select all columns and count
          .eq("parent_id", userId)
          // .eq('read', false) // Optionally filter for unread alerts
          .order("created_at", { ascending: false })
          .limit(5); // Limit to the 5 most recent alerts for the overview

        if (alertsError) throw alertsError;

        setAlerts(alertsData || []);
      } catch (err: any) {
        console.error("Error fetching alerts:", err);
        setError(err.message || "Failed to fetch alerts.");
        setAlerts([]); // Clear alerts on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "time_limit":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "blocked_site":
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case "new_app":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "bedtime":
        return <Clock className="h-4 w-4 text-indigo-500" />;
      case "unusual_activity":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <UiAlert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </UiAlert>
      );
    }

    if (alerts.length === 0) {
      return (
        <div className="text-center text-sm text-muted-foreground py-4">
          No recent alerts.
        </div>
      );
    }

    return alerts.map((alert) => (
      <div key={alert.id} className="flex items-start gap-4">
        <div
          className={`rounded-full p-1 ${
            alert.urgent ? "bg-red-100 dark:bg-red-900" : "bg-muted"
          }`}
        >
          {getAlertIcon(alert.type)}
        </div>
        <div className="space-y-1">
          <p
            className={`text-sm font-medium ${
              alert.urgent ? "text-red-600 dark:text-red-400" : ""
            }`}
          >
            {alert.message}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(alert.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
        {alerts.length > 0 && (
          <Link href="/alerts" className="text-xs text-primary hover:underline">
            View all
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{renderContent()}</CardContent>
    </Card>
  );
}
