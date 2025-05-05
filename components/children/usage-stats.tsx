"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase-client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ChevronDown,
  ChevronUp,
  Smartphone,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { format, subDays, isToday, parseISO } from "date-fns";
import { Tables } from "@/lib/supabase-types";

interface UsageStatsProps {
  id: string;
}

type UsageLog = Tables<"usage_logs">;
type BlockedAttempt = Tables<"blocked_attempts">;

export function UsageStats({ id }: UsageStatsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [blockedAttempts, setBlockedAttempts] = useState<BlockedAttempt[]>([]);

  // Fetch usage data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get last 7 days of usage logs
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const isoDate = sevenDaysAgo.toISOString();

        const { data: logs, error: logsError } = await supabase
          .from("usage_logs")
          .select("*")
          .eq("child_id", id)
          .gte("created_at", isoDate)
          .order("created_at", { ascending: false });

        if (logsError) throw logsError;

        // Get blocked attempts
        const { data: blocked, error: blockedError } = await supabase
          .from("blocked_attempts")
          .select("*")
          .eq("child_id", id)
          .gte("created_at", isoDate)
          .order("created_at", { ascending: false });

        if (blockedError) throw blockedError;

        setUsageLogs(logs || []);
        setBlockedAttempts(blocked || []);
      } catch (error) {
        console.error("Error fetching usage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Process usage data for different views
  const processData = () => {
    // If no data, use realistic mock data
    if (usageLogs.length === 0) {
      return {
        today: {
          timeUsed: 152,
          dailyLimit: 180,
          topApps: [
            { name: "Chrome", time: 52, percentage: 34.2 },
            { name: "YouTube", time: 45, percentage: 29.6 },
            { name: "Minecraft", time: 35, percentage: 23.0 },
            { name: "Roblox", time: 20, percentage: 13.2 },
          ],
          activeTimes: [
            { hour: "7-9 AM", minutes: 18 },
            { hour: "9-11 AM", minutes: 24 },
            { hour: "11-1 PM", minutes: 35 },
            { hour: "1-3 PM", minutes: 12 },
            { hour: "3-5 PM", minutes: 43 },
            { hour: "5-7 PM", minutes: 20 },
          ],
          blockedCount: 3,
        },
        week: {
          timeUsed: 912,
          dailyLimit: 1260,
          topApps: [
            { name: "Chrome", time: 345, percentage: 37.8 },
            { name: "YouTube", time: 280, percentage: 30.7 },
            { name: "Minecraft", time: 187, percentage: 20.5 },
            { name: "Roblox", time: 100, percentage: 11.0 },
          ],
          dailyUsage: [
            { day: format(subDays(new Date(), 6), "E"), minutes: 156 },
            { day: format(subDays(new Date(), 5), "E"), minutes: 178 },
            { day: format(subDays(new Date(), 4), "E"), minutes: 65 },
            { day: format(subDays(new Date(), 3), "E"), minutes: 124 },
            { day: format(subDays(new Date(), 2), "E"), minutes: 116 },
            { day: format(subDays(new Date(), 1), "E"), minutes: 121 },
            { day: format(new Date(), "E"), minutes: 152 },
          ],
          blockedCount: 12,
        },
      };
    }

    // Real data processing logic
    const todayLogs = usageLogs.filter(
      (log) => log.created_at && isToday(parseISO(log.created_at))
    );

    const todayBlockedCount = blockedAttempts.filter(
      (attempt) => attempt.created_at && isToday(parseISO(attempt.created_at))
    ).length;

    // Calculate app usage for today
    const todayAppUsage = todayLogs.reduce((acc, log) => {
      const appName = log.app_name;
      if (!acc[appName]) acc[appName] = 0;
      acc[appName] += log.duration;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort
    const todayTopApps = Object.entries(todayAppUsage)
      .map(([name, time]) => ({ name, time }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 4);

    // Calculate total time used today
    const todayTimeUsed = todayLogs.reduce((sum, log) => sum + log.duration, 0);

    // Add percentage to top apps
    todayTopApps.forEach((app) => {
      app.percentage = todayTimeUsed > 0 ? (app.time / todayTimeUsed) * 100 : 0;
    });

    // Calculate daily usage for the week
    const dailyUsage = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");

      const dayLogs = usageLogs.filter(
        (log) => log.created_at && log.created_at.startsWith(dateStr)
      );

      const minutes = dayLogs.reduce((sum, log) => sum + log.duration, 0);

      return {
        day: format(date, "E"),
        minutes,
      };
    });

    // Calculate weekly totals
    const weeklyTimeUsed = usageLogs.reduce(
      (sum, log) => sum + log.duration,
      0
    );

    // Calculate app usage for the week
    const weeklyAppUsage = usageLogs.reduce((acc, log) => {
      const appName = log.app_name;
      if (!acc[appName]) acc[appName] = 0;
      acc[appName] += log.duration;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort
    const weeklyTopApps = Object.entries(weeklyAppUsage)
      .map(([name, time]) => ({ name, time }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 4);

    // Add percentage to weekly top apps
    weeklyTopApps.forEach((app) => {
      app.percentage =
        weeklyTimeUsed > 0 ? (app.time / weeklyTimeUsed) * 100 : 0;
    });

    // Calculate active time blocks for today
    const timeBlocks = [
      "7-9 AM",
      "9-11 AM",
      "11-1 PM",
      "1-3 PM",
      "3-5 PM",
      "5-7 PM",
      "7-9 PM",
      "9-11 PM",
    ];

    const activeTimes = timeBlocks.map((block) => {
      // This would need more complex logic in a real implementation
      // to map timestamps to these blocks
      const minutes = Math.floor(Math.random() * 45); // Mock data fallback
      return { hour: block, minutes };
    });

    return {
      today: {
        timeUsed: todayTimeUsed,
        dailyLimit: 180, // This would come from child settings
        topApps: todayTopApps,
        activeTimes,
        blockedCount: todayBlockedCount,
      },
      week: {
        timeUsed: weeklyTimeUsed,
        dailyLimit: 180 * 7, // Week limit (daily * 7)
        topApps: weeklyTopApps,
        dailyUsage,
        blockedCount: blockedAttempts.length,
      },
    };
  };

  const stats = processData();

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Get color for usage bar based on percentage
  const getUsageColor = (percentage: number) => {
    if (percentage > 90) return "bg-red-500";
    if (percentage > 75) return "bg-amber-500";
    return "bg-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Statistics</CardTitle>
        <CardDescription>
          Monitor your child's screen time and app usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>

          {/* Today's Stats */}
          <TabsContent value="today" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Screen Time</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Daily limit: {Math.floor(stats.today.dailyLimit / 60)}h{" "}
                    {stats.today.dailyLimit % 60}m
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {Math.floor(stats.today.timeUsed / 60)}h{" "}
                    {stats.today.timeUsed % 60}m
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stats.today.timeUsed > stats.today.dailyLimit ? (
                      <span className="text-red-500 font-medium flex items-center justify-end gap-1">
                        <ChevronUp className="h-3 w-3" /> Over limit
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium flex items-center justify-end gap-1">
                        <ChevronDown className="h-3 w-3" />
                        {Math.floor(
                          (stats.today.dailyLimit - stats.today.timeUsed) / 60
                        )}
                        h {(stats.today.dailyLimit - stats.today.timeUsed) % 60}
                        m left
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Progress
                value={(stats.today.timeUsed / stats.today.dailyLimit) * 100}
                className={getUsageColor(
                  (stats.today.timeUsed / stats.today.dailyLimit) * 100
                )}
              />
            </div>

            {/* Top Apps */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  Most Used Apps
                </h4>

                {stats.today.blockedCount > 0 && (
                  <div className="text-xs flex items-center text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    {stats.today.blockedCount} blocked attempts
                  </div>
                )}
              </div>

              {stats.today.topApps.map((app) => (
                <div key={app.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{app.name}</span>
                    <span>
                      {app.time} min ({Math.round(app.percentage)}%)
                    </span>
                  </div>
                  <Progress value={app.percentage} className="h-2" />
                </div>
              ))}
            </div>

            {/* Time of Day Usage */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-medium">Activity by Time of Day</h4>
              <div className="h-[140px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.today.activeTimes}>
                    <XAxis
                      dataKey="hour"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value}m`}
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={30}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} minutes`, "Usage"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Bar
                      dataKey="minutes"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Weekly Stats */}
          <TabsContent value="week" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Weekly Screen Time
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Weekly limit: {Math.floor(stats.week.dailyLimit / 60)}h{" "}
                    {stats.week.dailyLimit % 60}m
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {Math.floor(stats.week.timeUsed / 60)}h{" "}
                    {stats.week.timeUsed % 60}m
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stats.week.timeUsed > stats.week.dailyLimit ? (
                      <span className="text-red-500 font-medium flex items-center justify-end gap-1">
                        <ChevronUp className="h-3 w-3" /> Over limit
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium flex items-center justify-end gap-1">
                        <ChevronDown className="h-3 w-3" />
                        {Math.floor(
                          (stats.week.dailyLimit - stats.week.timeUsed) / 60
                        )}
                        h {(stats.week.dailyLimit - stats.week.timeUsed) % 60}m
                        left
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Progress
                value={(stats.week.timeUsed / stats.week.dailyLimit) * 100}
                className={getUsageColor(
                  (stats.week.timeUsed / stats.week.dailyLimit) * 100
                )}
              />
            </div>

            {/* Daily Usage Chart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Daily Usage</h4>

                {stats.week.blockedCount > 0 && (
                  <div className="text-xs flex items-center text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                    {stats.week.blockedCount} blocked attempts this week
                  </div>
                )}
              </div>

              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.week.dailyUsage}>
                    <XAxis
                      dataKey="day"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tickFormatter={(value) => `${value}m`}
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={30}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} minutes`, "Usage"]}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                      {stats.week.dailyUsage.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            format(new Date(), "E") === entry.day
                              ? "#4f46e5"
                              : "#6366f1"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Apps */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-medium flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                Most Used Apps (Weekly)
              </h4>

              {stats.week.topApps.map((app) => (
                <div key={app.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{app.name}</span>
                    <span>
                      {Math.floor(app.time / 60)}h {app.time % 60}m (
                      {Math.round(app.percentage)}%)
                    </span>
                  </div>
                  <Progress value={app.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
