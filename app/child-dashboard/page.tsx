"use client";

import { useEffect, useState } from "react";
import { ChildHeader } from "@/components/child/child-header";
import { TimeRemaining } from "@/components/child/time-remaining";
import { UsageSummary } from "@/components/child/usage-summary";
import { BlockedAttempts } from "@/components/child/blocked-attempts";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Smartphone,
  Calendar,
  Clock,
  Lock,
  Gamepad,
  Video,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Define types for our data
interface ChildDevice {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  os_type: string;
  last_active: string | null;
  is_active: boolean;
  children: {
    id: string;
    name: string;
    age: number | null;
    status: string;
    time_used: number;
    daily_limit: number;
    bedtime_start: string;
    bedtime_end: string;
    bedtime_enabled: boolean;
    last_active: string | null;
    [key: string]: any;
  };
  [key: string]: any;
}

export default function ChildDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [deviceData, setDeviceData] = useState<ChildDevice | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkChildSession = async () => {
      try {
        // Get the stored device data
        const storedData = localStorage.getItem("childDeviceData");

        if (!storedData) {
          // If no device data, redirect to login
          throw new Error("No device data found");
        }

        const parsedData = JSON.parse(storedData);
        setDeviceData(parsedData);
      } catch (error) {
        console.error("Error loading child data:", error);
        // Clear any invalid data and redirect
        localStorage.removeItem("childDeviceData");
        router.push("/child-login");
      } finally {
        setIsLoading(false);
      }
    };

    checkChildSession();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-primary">
            Loading your fun dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!deviceData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border-2 border-primary">
          <p className="text-xl">Oops! Session expired. Please log in again.</p>
          <button
            onClick={() => router.push("/child-login")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            Go Back to Login
          </button>
        </div>
      </div>
    );
  }

  const { children: childData } = deviceData;

  // If no time used data, use a placeholder
  const timeUsed = childData.time_used || 0;
  const dailyLimit = childData.daily_limit || 120;

  // Get app icon based on name
  const getAppIcon = (appName: string) => {
    const name = appName.toLowerCase();
    if (name.includes("roblox"))
      return <Gamepad className="h-5 w-5 text-blue-500" />;
    if (name.includes("youtube") || name.includes("tiktok"))
      return <Video className="h-5 w-5 text-red-500" />;
    return <Globe className="h-5 w-5 text-purple-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <div className="flex flex-col gap-6 p-6 w-full max-w-screen-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-2">
          <ChildHeader childName={childData.name} deviceData={deviceData} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {/* Device Info Card */}
          <Card className="md:col-span-2 xl:col-span-1 rounded-2xl shadow-md border-2 border-blue-200 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-blue-100 to-blue-50">
              <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                <Smartphone className="h-5 w-5 text-blue-600" />
                My Device
              </CardTitle>
              <CardDescription className="text-blue-600/80">
                Your connected device
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <div className="text-sm text-blue-700 font-medium">
                    Device Name:
                  </div>
                  <div className="font-bold text-blue-800">
                    {deviceData.device_name}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <div className="text-sm text-blue-700 font-medium">Type:</div>
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-bold text-blue-800">
                      {deviceData.device_type}
                    </span>
                    <Badge className="capitalize bg-blue-200 text-blue-800 hover:bg-blue-300">
                      {deviceData.os_type || "Unknown OS"}
                    </Badge>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <div className="text-sm text-blue-700 font-medium">
                    Status:
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        deviceData.is_active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="font-bold text-blue-800">
                      {deviceData.is_active ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Remaining - Large colorful display */}
          <Card className="md:col-span-2 xl:col-span-1 rounded-2xl shadow-md border-2 border-green-200 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-green-100 to-green-50">
              <CardTitle className="text-base flex items-center gap-2 text-green-700">
                <Clock className="h-5 w-5 text-green-600" />
                Time Remaining Today
              </CardTitle>
              <CardDescription className="text-green-600/80">
                You have used{" "}
                {timeUsed
                  ? `${Math.floor(timeUsed / 60)}h ${timeUsed % 60}m`
                  : "0h 0m"}{" "}
                of your daily limit
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center justify-center">
              <div className="text-6xl font-bold text-center text-green-600 my-4">
                {Math.floor((dailyLimit - timeUsed) / 60)}:
                {((dailyLimit - timeUsed) % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-green-600/80 text-center mb-2">
                hours remaining
              </div>

              {/* Progress bar */}
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  style={{
                    width: `${Math.min(100, (timeUsed / dailyLimit) * 100)}%`,
                  }}
                ></div>
              </div>
              <div className="w-full flex justify-between text-xs text-green-600 mt-1">
                <span>0h</span>
                <span>
                  {Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2 rounded-2xl shadow-md border-2 border-purple-200 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-100 to-purple-50">
              <CardTitle className="text-base flex items-center gap-2 text-purple-700">
                <Calendar className="h-5 w-5 text-purple-600" />
                Today's Schedule
              </CardTitle>
              <CardDescription className="text-purple-600/80">
                Your daily limits and bedtime
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 shadow-sm">
                  <div className="text-sm text-purple-700 font-medium flex items-center gap-1.5 mb-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    Daily Limit
                  </div>
                  <div className="font-bold text-2xl text-purple-800">
                    {Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 shadow-sm">
                  <div className="text-sm text-indigo-700 font-medium flex items-center gap-1.5 mb-2">
                    <Lock className="h-4 w-4 text-indigo-600" />
                    Bedtime
                    {!childData.bedtime_enabled && (
                      <Badge
                        variant="outline"
                        className="ml-1 text-xs bg-indigo-100 text-indigo-700 border-indigo-300"
                      >
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <div className="font-bold text-2xl text-indigo-800">
                    {childData.bedtime_start.substring(0, 5)} -{" "}
                    {childData.bedtime_end.substring(0, 5)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* App Usage */}
          <Card className="rounded-2xl shadow-md border-2 border-orange-200 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-orange-100 to-orange-50">
              <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                <Gamepad className="h-5 w-5 text-orange-600" />
                Today's App Usage
              </CardTitle>
              <CardDescription className="text-orange-600/80">
                What you've been using today
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Roblox */}
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getAppIcon("Roblox")}
                    <span className="font-medium text-orange-800">Roblox</span>
                  </div>
                  <span className="text-orange-700 font-medium">70 min</span>
                </div>
                <div className="w-full h-3 bg-orange-100 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>

              {/* YouTube */}
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getAppIcon("YouTube")}
                    <span className="font-medium text-orange-800">YouTube</span>
                  </div>
                  <span className="text-orange-700 font-medium">23 min</span>
                </div>
                <div className="w-full h-3 bg-orange-100 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                    style={{ width: "23%" }}
                  ></div>
                </div>
              </div>

              {/* Chrome */}
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getAppIcon("Chrome")}
                    <span className="font-medium text-orange-800">Chrome</span>
                  </div>
                  <span className="text-orange-700 font-medium">5 min</span>
                </div>
                <div className="w-full h-3 bg-orange-100 rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blocked Attempts */}
          <Card className="rounded-2xl shadow-md border-2 border-red-200 overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-red-100 to-red-50">
              <CardTitle className="text-base flex items-center gap-2 text-red-700">
                <Lock className="h-5 w-5 text-red-600" />
                Blocked Attempts
              </CardTitle>
              <CardDescription className="text-red-600/80">
                Sites that were blocked today
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Blocked sites - examples */}
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-red-800">
                    unwanted-site.com
                  </div>
                  <div className="text-xs text-red-600">
                    15:56 • Reason: blocked_site
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-red-800">TikTok</div>
                  <div className="text-xs text-red-600">
                    15:56 • Reason: blocked_app
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
