"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import type { Tables } from "@/lib/supabase-types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert as UiAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CalendarDays,
  Edit2,
  Phone,
  School,
  Terminal,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ChildProfileProps {
  id: string;
}

type Child = Tables<"children">;
type Device = Tables<"devices">;

export function ChildProfile({ id }: ChildProfileProps) {
  const [child, setChild] = useState<Child | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch child data
  useEffect(() => {
    const fetchChildData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch child profile
        const { data: childData, error: childError } = await supabase
          .from("children")
          .select("*")
          .eq("id", id)
          .single();

        if (childError) throw childError;
        if (!childData) throw new Error("Child not found.");

        setChild(childData);

        // Fetch child's devices
        const { data: deviceData, error: deviceError } = await supabase
          .from("devices")
          .select("*")
          .eq("child_id", id);

        if (deviceError) throw deviceError;
        setDevices(deviceData || []);
      } catch (err: any) {
        console.error("Error fetching child profile:", err);
        setError(err.message || "Failed to load profile.");
        setChild(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchChildData();
    }
  }, [id]);

  // Render Loading State
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Error State
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <UiAlert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Failed to Load Profile</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </UiAlert>
        </CardContent>
      </Card>
    );
  }

  // Render Profile Data
  if (!child) {
    return (
      <Card>
        <CardContent>Child data not available.</CardContent>
      </Card>
    );
  }

  // Get current status with color
  const getStatusBadge = () => {
    const status = child.status || "offline";
    const colorMap: Record<string, string> = {
      online: "bg-green-500",
      offline: "bg-gray-400",
      restricted: "bg-amber-500",
      blocked: "bg-red-500",
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colorMap[status]}`}></div>
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Profile Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
        <CardDescription>
          View and manage your child's profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="h-24 w-24 border-2 border-blue-100">
            {child.avatar_url ? (
              <AvatarImage src={child.avatar_url} alt={child.name} />
            ) : (
              <AvatarFallback className="text-3xl bg-blue-50 text-blue-500">
                {child.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h3 className="text-2xl font-bold">{child.name}</h3>
              <Badge variant="outline" className="ml-0 sm:ml-2 self-center">
                {getStatusBadge()}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {child.age ? `${child.age} years old` : "Age not set"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />
              Added on {format(new Date(child.created_at), "PPP")}
            </p>
            {child.last_active && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Last active: {format(new Date(child.last_active), "Pp")}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name-edit">Name</Label>
              <Input
                id="name-edit"
                defaultValue={child.name}
                placeholder="Child's name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age-edit">Age</Label>
              <Input
                id="age-edit"
                type="number"
                defaultValue={child.age || ""}
                placeholder="Age"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pin-edit">PIN</Label>
              <Input
                id="pin-edit"
                type="password"
                defaultValue={child.pin || ""}
                placeholder="Device unlock PIN"
              />
              <p className="text-xs text-muted-foreground">
                PIN is used by your child to unlock restricted devices.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-medium">{child.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Age</Label>
                <p className="font-medium">{child.age || "Not set"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">PIN</Label>
                <p className="font-medium">{child.pin ? "••••" : "Not set"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Time Used Today
                </Label>
                <p className="font-medium">
                  {Math.floor(child.time_used / 60)}h {child.time_used % 60}m
                </p>
              </div>
            </div>
          </div>
        )}

        {devices.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">
                Devices ({devices.length})
              </h4>
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between rounded-md border p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          device.is_active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="font-medium">{device.device_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {device.device_type} • {device.os_type}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {device.last_active
                        ? format(new Date(device.last_active), "Pp")
                        : "Never used"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
