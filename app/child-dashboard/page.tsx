"use client";

import { useEffect, useState } from "react";
import { ChildHeader } from "@/components/child/child-header";
import { TimeRemaining } from "@/components/child/time-remaining";
import { UsageSummary } from "@/components/child/usage-summary";
import { BlockedAttempts } from "@/components/child/blocked-attempts";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function ChildDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [childData, setChildData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkChildSession = async () => {
      const childId = localStorage.getItem("childId");
      const deviceId = localStorage.getItem("deviceId");

      if (!childId || !deviceId) {
        // If no child session, redirect to login
        router.push("/child-login");
        return;
      }

      try {
        // Fetch the latest child data
        const { data, error } = await supabase
          .from("children")
          .select("*")
          .eq("id", childId)
          .single();

        if (error || !data) {
          throw error;
        }

        setChildData(data);
      } catch (error) {
        console.error("Error fetching child data:", error);
        localStorage.removeItem("childId");
        localStorage.removeItem("deviceId");
        localStorage.removeItem("childName");
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

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <ChildHeader childName={childData?.name} />
      <div className="grid gap-6 md:grid-cols-2">
        <TimeRemaining
          timeUsed={childData?.time_used || 0}
          dailyLimit={childData?.daily_limit || 0}
        />
        <UsageSummary childId={childData?.id} />
      </div>
      <BlockedAttempts childId={childData?.id} />
    </div>
  );
}
