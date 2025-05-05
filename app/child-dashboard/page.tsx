"use client";

import { useEffect, useState } from "react";
import { ChildHeader } from "@/components/child/child-header";
import { TimeRemaining } from "@/components/child/time-remaining";
import { UsageSummary } from "@/components/child/usage-summary";
import { BlockedAttempts } from "@/components/child/blocked-attempts";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Calendar, Clock, Lock } from "lucide-react";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!deviceData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Session expired. Please log in again.</p>
        </div>
      </div>
    );
  }

  const { children: childData } = deviceData;

  // If no time used data, use a placeholder
  const timeUsed = childData.time_used || 0;
  const dailyLimit = childData.daily_limit || 120;

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-screen-xl mx-auto">
      <ChildHeader childName={childData.name} deviceData={deviceData} />
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Device Info Card */}
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-500" />
              Device Information
            </CardTitle>
            <CardDescription>Your connected device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Device Name:</div>
                <div className="font-medium">{deviceData.device_name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Type:</div>
                <div className="flex items-center gap-2">
                  <span className="capitalize">{deviceData.device_type}</span>
                  <Badge variant="outline" className="capitalize">
                    {deviceData.os_type || "Unknown OS"}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status:</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${deviceData.is_active ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <span>{deviceData.is_active ? "Online" : "Offline"}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Last Active:</div>
                <div>{deviceData.last_active ? format(new Date(deviceData.last_active), "PPp") : "First login"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <TimeRemaining
          timeUsed={timeUsed}
          dailyLimit={dailyLimit}
        />
        
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your daily limits and bedtime</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-md border bg-gray-50">
                <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Clock className="h-3.5 w-3.5" />
                  Daily Limit
                </div>
                <div className="font-semibold text-lg">
                  {Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m
                </div>
              </div>
              
              <div className="p-3 rounded-md border bg-gray-50">
                <div className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Lock className="h-3.5 w-3.5" />
                  Bedtime 
                  {!childData.bedtime_enabled && <Badge variant="outline" className="ml-1 text-xs">Disabled</Badge>}
                </div>
                <div className="font-semibold text-lg">
                  {childData.bedtime_start.substring(0, 5)} - {childData.bedtime_end.substring(0, 5)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <UsageSummary childId={childData.id} />
        <BlockedAttempts childId={childData.id} />
      </div>
    </div>
  );
}
