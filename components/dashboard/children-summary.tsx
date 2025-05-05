"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import type { Tables } from "@/lib/supabase-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

// Define the type for a child, using the generated types
type Child = Tables<"children">;

export function ChildrenSummary() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChildren = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Get the current user session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!sessionData.session) {
          // Although the page should be protected, handle this case
          throw new Error("Not authenticated");
        }

        const userId = sessionData.session.user.id;

        // 2. Fetch children associated with the logged-in parent
        const { data: childrenData, error: childrenError } = await supabase
          .from("children")
          .select("*") // Select all columns
          .eq("parent_id", userId);

        if (childrenError) throw childrenError;

        setChildren(childrenData || []);
      } catch (err: any) {
        console.error("Error fetching children:", err);
        setError(err.message || "Failed to fetch children data.");
        setChildren([]); // Clear children on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (children.length === 0) {
      return (
        <div className="text-center text-sm text-muted-foreground py-4">
          No children added yet.{" "}
          <Link href="/children/add" className="text-primary hover:underline">
            Add Child
          </Link>
        </div>
      );
    }

    return children.map((child) => (
      <div key={child.id} className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          {child.avatar_url && (
            <AvatarImage src={child.avatar_url} alt={child.name} />
          )}
          <AvatarFallback>{child.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{child.name}</p>
            <span className="text-xs text-muted-foreground">
              {Math.floor(child.time_used / 60)}h {child.time_used % 60}m /{" "}
              {Math.floor(child.daily_limit / 60)}h {child.daily_limit % 60}m
            </span>
          </div>
          {/* Ensure daily_limit is not zero to avoid division by zero */}
          <Progress
            value={
              child.daily_limit > 0
                ? (child.time_used / child.daily_limit) * 100
                : 0
            }
          />
        </div>
      </div>
    ));
  };

  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Children</CardTitle>
        {/* Conditionally show View All link only if there are children */}
        {children.length > 0 && (
          <Link
            href="/children"
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4">{renderContent()}</CardContent>
    </Card>
  );
}
