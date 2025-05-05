"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  ShieldAlert,
  AlertCircle,
  Activity,
  MessageSquare,
} from "lucide-react";
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

// Mock data to display when no real data is available
const mockAlerts: AlertData[] = [
  {
    id: "mock-1",
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    parent_id: "mock-parent",
    child_id: "mock-1",
    type: "time_limit",
    message: "Emma has reached 80% of daily screen time",
    read: false,
    urgent: false,
  },
  {
    id: "mock-2",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    parent_id: "mock-parent",
    child_id: "mock-2",
    type: "blocked_site",
    message: "Noah attempted to access a blocked website",
    read: false,
    urgent: true,
  },
  {
    id: "mock-3",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    parent_id: "mock-parent",
    child_id: "mock-1",
    type: "new_app",
    message: "Emma installed a new app: TikTok",
    read: true,
    urgent: false,
  },
  {
    id: "mock-4",
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    parent_id: "mock-parent",
    child_id: "mock-3",
    type: "bedtime",
    message: "Sophia used device past bedtime (10:30 PM)",
    read: false,
    urgent: true,
  },
  {
    id: "mock-5",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    parent_id: "mock-parent",
    child_id: "mock-3",
    type: "unusual_activity",
    message: "Unusual activity detected on Sophia's device",
    read: false,
    urgent: false,
  },
];

export function AlertsOverview() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Get the current user session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!sessionData.session) {
          // If not authenticated, use mock data
          setUseMockData(true);
          throw new Error("Not authenticated");
        }

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

        // If no alerts are found, use mock data
        if (!alertsData || alertsData.length === 0) {
          setUseMockData(true);
          setAlerts(mockAlerts);
        } else {
          setAlerts(alertsData);
        }
      } catch (err: any) {
        console.error("Error fetching alerts:", err);
        setError(err.message || "Failed to fetch alerts.");
        // Use mock data on error
        setUseMockData(true);
        setAlerts(mockAlerts);
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
      case "message":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
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

    if (error && !useMockData) {
      return (
        <UiAlert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </UiAlert>
      );
    }

    if (alerts.length === 0 && !useMockData) {
      return (
        <div className="text-center text-sm text-muted-foreground py-4">
          No recent alerts.
        </div>
      );
    }

    // Only show first 4 alerts in the overview
    return alerts.slice(0, 4).map((alert) => (
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
            {!alert.read && <span className="ml-2 text-primary">● New</span>}
          </p>
        </div>
      </div>
    ));
  };

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
          {unreadCount > 0 && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </div>
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
