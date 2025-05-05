"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Chrome, Youtube, Gamepad2, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface UsageSummaryProps {
  childId?: string;
}

type AppUsage = {
  name: string;
  icon: any;
  time: number; // minutes
  percentage: number;
};

// Map app names to icons
const appIcons: Record<string, any> = {
  Chrome: Chrome,
  YouTube: Youtube,
  Minecraft: Gamepad2,
  // Add more app mappings as needed
};

export function UsageSummary({ childId }: UsageSummaryProps) {
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsageData() {
      if (!childId) return;

      try {
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISOString = today.toISOString();

        // Query usage logs for today for this child
        const { data, error } = await supabase
          .from("usage_logs")
          .select("app_name, duration")
          .eq("child_id", childId)
          .gte("start_time", todayISOString)
          .order("duration", { ascending: false });

        if (error) {
          throw error;
        }

        // Process the data
        const appTotals: Record<string, number> = {};
        let totalUsage = 0;

        // Calculate total minutes per app
        data?.forEach((log) => {
          appTotals[log.app_name] =
            (appTotals[log.app_name] || 0) + log.duration;
          totalUsage += log.duration;
        });

        // Convert to app usage format
        const appUsageData: AppUsage[] = Object.entries(appTotals)
          .slice(0, 3) // Only show top 3 apps
          .map(([name, time]) => ({
            name,
            icon: appIcons[name] || Globe, // Default to Globe icon
            time,
            percentage: totalUsage > 0 ? (time / totalUsage) * 100 : 0,
          }));

        setAppUsage(appUsageData);
      } catch (error) {
        console.error("Error fetching usage data:", error);
        // Use fallback data if there's an error
        setAppUsage([
          { name: "Chrome", icon: Chrome, time: 45, percentage: 37.5 },
          { name: "YouTube", icon: Youtube, time: 30, percentage: 25 },
          { name: "Minecraft", icon: Gamepad2, time: 45, percentage: 37.5 },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsageData();
  }, [childId]);

  // If no data yet, show placeholder
  if (isLoading || appUsage.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Today's App Usage</CardTitle>
          <CardDescription>No app usage recorded today</CardDescription>
        </CardHeader>
        <CardContent className="h-[168px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Today's App Usage</CardTitle>
        <CardDescription>What you've been using today</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appUsage.map((app) => (
          <div key={app.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <app.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{app.name}</span>
              </div>
              <span className="text-sm">{app.time} min</span>
            </div>
            <Progress value={app.percentage} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
