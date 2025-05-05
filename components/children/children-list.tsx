"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Settings,
  ShieldAlert,
  WifiOff,
  Laptop,
  Smartphone,
  Tablet,
  BookOpenCheck,
  Brain,
  Gamepad2,
  Video,
  MonitorSmartphone,
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
import { formatDistanceToNowStrict } from "date-fns";
import { useSearchParams } from "next/navigation";

type Child = Tables<"children">;

// Added mock device and activity data
type DeviceType = "phone" | "tablet" | "computer";
type AppCategory = "education" | "gaming" | "video" | "social" | "other";

interface MockActivityData {
  deviceType: DeviceType;
  appName: string;
  category: AppCategory;
  blockedAttempts: number;
  topApps: { name: string; category: AppCategory; minutes: number }[];
}

const getAppIcon = (category: AppCategory) => {
  switch (category) {
    case "education":
      return <BookOpenCheck className="h-4 w-4" />;
    case "gaming":
      return <Gamepad2 className="h-4 w-4" />;
    case "video":
      return <Video className="h-4 w-4" />;
    case "social":
      return <MonitorSmartphone className="h-4 w-4" />;
    default:
      return <Brain className="h-4 w-4" />;
  }
};

const getDeviceIcon = (deviceType: DeviceType) => {
  switch (deviceType) {
    case "phone":
      return <Smartphone className="h-4 w-4" />;
    case "tablet":
      return <Tablet className="h-4 w-4" />;
    case "computer":
      return <Laptop className="h-4 w-4" />;
    default:
      return <Laptop className="h-4 w-4" />;
  }
};

const getCategoryColor = (category: AppCategory) => {
  switch (category) {
    case "education":
      return "bg-blue-100 text-blue-800";
    case "gaming":
      return "bg-purple-100 text-purple-800";
    case "video":
      return "bg-red-100 text-red-800";
    case "social":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Generate complete mock data for a child profile
const generateMockData = (child: Child): [Child, MockActivityData] => {
  // Generate random time_used between 30 minutes and 80% of daily limit
  const maxTime = child.daily_limit * 0.8;
  const minTime = Math.min(30, child.daily_limit * 0.2);
  const time_used = Math.floor(Math.random() * (maxTime - minTime) + minTime);

  // Random status with higher chance of being online (active)
  const statusRand = Math.random();
  const status =
    statusRand < 0.6 ? "active" : statusRand < 0.9 ? "offline" : "locked";

  // Random last active time in the last 8 hours
  const lastActiveTime = new Date(
    Date.now() - Math.random() * 8 * 60 * 60 * 1000
  ).toISOString();

  // Random device type
  const deviceTypes: DeviceType[] = ["phone", "tablet", "computer"];
  const deviceType =
    deviceTypes[Math.floor(Math.random() * deviceTypes.length)];

  // Random app categories
  const appCategories: AppCategory[] = [
    "education",
    "gaming",
    "video",
    "social",
    "other",
  ];

  // Generate top apps
  const topApps = [];
  const numApps = Math.floor(Math.random() * 3) + 1; // 1-3 apps

  const appNames = {
    education: ["Khan Academy", "Duolingo", "Quizlet", "Brainly"],
    gaming: ["Roblox", "Minecraft", "Candy Crush", "Among Us"],
    video: ["YouTube", "TikTok", "Netflix", "Disney+"],
    social: ["Instagram", "Snapchat", "WhatsApp", "Messenger"],
    other: ["Chrome", "Safari", "Gmail", "Calendar"],
  };

  for (let i = 0; i < numApps; i++) {
    const category =
      appCategories[Math.floor(Math.random() * appCategories.length)];
    const names = appNames[category];
    const name = names[Math.floor(Math.random() * names.length)];
    const minutes = Math.floor(Math.random() * 60) + 5; // 5-65 minutes

    topApps.push({
      name,
      category,
      minutes,
    });
  }

  // Random blocked attempts (0-5)
  const blockedAttempts = Math.floor(Math.random() * 6);

  // Pick a random app for current usage
  const currentAppIndex = Math.floor(Math.random() * topApps.length);
  const currentApp = topApps[currentAppIndex].name;

  const updatedChild = {
    ...child,
    time_used: child.time_used > 0 ? child.time_used : time_used,
    status: child.status || status,
    last_active: child.last_active || lastActiveTime,
  };

  const activityData: MockActivityData = {
    deviceType,
    appName: currentApp,
    category: topApps[currentAppIndex].category,
    blockedAttempts,
    topApps,
  };

  return [updatedChild, activityData];
};

// Client component that uses useSearchParams
function ChildrenListWithRefresh({
  onRefreshChange,
}: {
  onRefreshChange: (refresh: string | null) => void;
}) {
  const searchParams = useSearchParams();

  // Get the refresh parameter to trigger refetches
  const refreshTrigger = searchParams.get("refresh");

  useEffect(() => {
    onRefreshChange(refreshTrigger);
  }, [refreshTrigger, onRefreshChange]);

  return null;
}

export function ChildrenList() {
  const [children, setChildren] = useState<Child[]>([]);
  const [activityData, setActivityData] = useState<{
    [key: string]: MockActivityData;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!sessionData.session) throw new Error("Not authenticated");

        const userId = sessionData.session.user.id;

        // Fetch ALL children for this parent, ordered by name
        const { data: childrenData, error: childrenError } = await supabase
          .from("children")
          .select("*")
          .eq("parent_id", userId)
          .order("name", { ascending: true }); // Order alphabetically

        if (childrenError) throw childrenError;

        let finalChildren: Child[] = [];
        let mockActivityData: { [key: string]: MockActivityData } = {};
        let useMockDataFlag = false;

        if (childrenData && childrenData.length > 0) {
          // Generate mock data for all profiles to ensure consistent display
          finalChildren = [];
          childrenData.forEach((child) => {
            const [updatedChild, activityData] = generateMockData(child);
            finalChildren.push(updatedChild);
            mockActivityData[child.id] = activityData;
          });
          useMockDataFlag = true;
        } else {
          finalChildren = [];
        }

        setChildren(finalChildren);
        setActivityData(mockActivityData);
        setUsingMockData(useMockDataFlag);
      } catch (err: any) {
        console.error("Error fetching children list:", err);
        setError(err.message || "Failed to fetch children data.");
        setChildren([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [refreshTrigger]); // Use the state variable refreshTrigger

  const formatLastActive = (timestamp: string | null) => {
    if (!timestamp) return "Never";
    try {
      return formatDistanceToNowStrict(new Date(timestamp), {
        addSuffix: true,
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <UiAlert variant="destructive" className="col-span-full">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Children</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </UiAlert>
    );
  }

  if (children.length === 0) {
    return (
      <div className="col-span-full text-center text-muted-foreground py-10">
        No children have been added yet.
        {/* The Add Child button is likely in the parent page layout */}
      </div>
    );
  }

  return (
    <>
      <ChildrenListWithRefresh onRefreshChange={setRefreshTrigger} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => {
          const childActivity = activityData[child.id];
          const timePercent =
            child.daily_limit > 0
              ? (child.time_used / child.daily_limit) * 100
              : 0;

          // Colors based on time usage
          const progressColor =
            timePercent > 85
              ? "bg-red-500"
              : timePercent > 65
              ? "bg-amber-500"
              : "bg-green-500";

          return (
            <Card
              key={child.id}
              className={
                child.status === "locked"
                  ? "border-red-200"
                  : child.status === "active"
                  ? "border-green-200"
                  : ""
              }
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      {child.avatar_url && (
                        <AvatarImage src={child.avatar_url} alt={child.name} />
                      )}
                      <AvatarFallback
                        className={
                          child.status === "active"
                            ? "bg-green-100 text-green-800"
                            : child.status === "locked"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100"
                        }
                      >
                        {child.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{child.name}</CardTitle>
                      {child.age && (
                        <CardDescription>{child.age} years old</CardDescription>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/children/${child.id}`}>
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Screen Time</span>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.floor(child.time_used / 60)}h {child.time_used % 60}
                      m /{Math.floor(child.daily_limit / 60)}h{" "}
                      {child.daily_limit % 60}m
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressColor} transition-all`}
                      style={{ width: `${timePercent}%` }}
                    />
                  </div>
                </div>

                {/* Status and device info */}
                <div className="flex justify-between text-sm">
                  <div className="text-left">
                    <div
                      className={`font-medium flex items-center gap-1 ${
                        child.status === "active"
                          ? "text-green-600"
                          : child.status === "locked"
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {child.status === "active" ? (
                        childActivity ? (
                          getDeviceIcon(childActivity.deviceType)
                        ) : (
                          <Laptop className="h-4 w-4" />
                        )
                      ) : child.status === "locked" ? (
                        <ShieldAlert className="h-4 w-4" />
                      ) : (
                        <WifiOff className="h-4 w-4" />
                      )}
                      {child.status
                        ? child.status.charAt(0).toUpperCase() +
                          child.status.slice(1)
                        : "Offline"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {child.status === "active" && childActivity
                        ? `Using ${childActivity.appName}`
                        : child.last_active
                        ? formatLastActive(child.last_active)
                        : "-"}
                    </div>
                  </div>

                  {/* Additional activity data */}
                  {childActivity && childActivity.blockedAttempts > 0 && (
                    <div className="bg-red-50 text-red-700 rounded-md px-2 py-1 text-xs flex items-center">
                      <ShieldAlert className="h-3 w-3 mr-1" />
                      {childActivity.blockedAttempts} blocked
                    </div>
                  )}
                </div>

                {/* Top apps display */}
                {childActivity && childActivity.topApps.length > 0 && (
                  <div className="border-t pt-3">
                    <div className="text-xs text-muted-foreground mb-2">
                      Top activity
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {childActivity.topApps.map((app, index) => (
                        <div
                          key={index}
                          className={`text-xs rounded-full px-2 py-0.5 flex items-center gap-1 ${getCategoryColor(
                            app.category
                          )}`}
                        >
                          {getAppIcon(app.category)}
                          {app.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/children/${child.id}`}>Manage Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
