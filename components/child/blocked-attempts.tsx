"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface BlockedAttemptsProps {
  childId?: string;
}

type BlockedAttempt = {
  id: string;
  url?: string | null;
  app_name?: string | null;
  reason: string;
  created_at: string;
};

export function BlockedAttempts({ childId }: BlockedAttemptsProps) {
  const [blockedAttempts, setBlockedAttempts] = useState<BlockedAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlockedAttempts() {
      if (!childId) return;

      try {
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayISOString = today.toISOString();

        // Query blocked attempts for today for this child
        const { data, error } = await supabase
          .from("blocked_attempts")
          .select("id, url, app_name, reason, created_at")
          .eq("child_id", childId)
          .gte("created_at", todayISOString)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        setBlockedAttempts(data || []);
      } catch (error) {
        console.error("Error fetching blocked attempts:", error);
        // Use fallback data if there's an error
        setBlockedAttempts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlockedAttempts();
  }, [childId]);

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocked Attempts</CardTitle>
        <CardDescription>Sites that were blocked today</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading blocked attempts...
            </p>
          </div>
        ) : blockedAttempts.length > 0 ? (
          <div className="space-y-4">
            {blockedAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-1">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">
                    {attempt.url || attempt.app_name || "Unknown"}
                  </p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>{formatTime(attempt.created_at)}</span>
                    <span>•</span>
                    <span>Reason: {attempt.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No blocked attempts today.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
