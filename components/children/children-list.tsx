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
import { Clock, Settings, ShieldAlert, WifiOff } from "lucide-react";
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

type Child = Tables<"children">;

export function ChildrenList() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        setChildren(childrenData || []);
      } catch (err: any) {
        console.error("Error fetching children list:", err);
        setError(err.message || "Failed to fetch children data.");
        setChildren([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

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

  if (error) {
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children.map((child) => (
        <Card key={child.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  {child.avatar_url && (
                    <AvatarImage src={child.avatar_url} alt={child.name} />
                  )}
                  <AvatarFallback>
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
                  {Math.floor(child.time_used / 60)}h {child.time_used % 60}m /
                  {Math.floor(child.daily_limit / 60)}h {child.daily_limit % 60}
                  m
                </span>
              </div>
              <Progress
                value={
                  child.daily_limit > 0
                    ? (child.time_used / child.daily_limit) * 100
                    : 0
                }
              />
            </div>
            <div className="flex justify-between text-sm">
              {/* TODO: Fetch actual blocked count if needed */}
              {/* <div>
                <p className="font-medium">?</p>
                <p className="text-muted-foreground">Blocked Sites</p>
              </div> */}
              <div className="text-left">
                <p
                  className={`font-medium flex items-center gap-1 ${
                    child.status === "active"
                      ? "text-green-600"
                      : child.status === "locked"
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {child.status === "active" ? (
                    <WifiOff className="h-4 w-4" />
                  ) : child.status === "locked" ? (
                    <ShieldAlert className="h-4 w-4" />
                  ) : (
                    <WifiOff className="h-4 w-4" />
                  )}
                  {child.status
                    ? child.status.charAt(0).toUpperCase() +
                      child.status.slice(1)
                    : "Offline"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {child.last_active
                    ? formatLastActive(child.last_active)
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/children/${child.id}`}>Manage Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
