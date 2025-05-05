"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase-client";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardHeader() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string | null;
    unreadAlerts: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Current date formatted nicely
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // If not authenticated, use fallback data
          setUser({
            name: "Guest User",
            email: "guest@example.com",
            avatar: null,
            unreadAlerts: 0,
          });
          return;
        }

        const userId = sessionData.session.user.id;

        // Fetch parent info
        const { data: parentData, error: parentError } = await supabase
          .from("parents")
          .select("name, email, avatar_url")
          .eq("id", userId)
          .single();

        if (parentError) throw parentError;

        // Count unread alerts
        const { count, error: alertError } = await supabase
          .from("alerts")
          .select("*", { count: "exact" })
          .eq("parent_id", userId)
          .eq("read", false);

        if (alertError) throw alertError;

        setUser({
          name:
            parentData?.name ||
            sessionData.session.user.email?.split("@")[0] ||
            "User",
          email: parentData?.email || sessionData.session.user.email || "",
          avatar: parentData?.avatar_url,
          unreadAlerts: count || 0,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to email from auth if profile fetch fails
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setUser({
            name: data.session.user.email?.split("@")[0] || "User",
            email: data.session.user.email || "",
            avatar: null,
            unreadAlerts: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Badge variant="outline" className="text-xs">
            {today}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Monitor your children's device usage and internet activity
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href="/alerts">
            <Bell className="h-4 w-4" />
            {user && user.unreadAlerts > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            )}
            <span className="sr-only">Alerts</span>
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2 border rounded-md p-2 min-w-[120px]">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="hidden md:block space-y-1 flex-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-24" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="h-8 w-8">
                {user?.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}
                <AvatarFallback>
                  {user?.name.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
