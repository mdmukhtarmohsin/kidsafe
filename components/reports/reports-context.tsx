"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase-client";
import {
  addDays,
  subDays,
  format,
  parse,
  startOfDay,
  endOfDay,
} from "date-fns";
import type { Database } from "@/lib/supabase-types";

// Types for our context
export type Child = Database["public"]["Tables"]["children"]["Row"];

export type AppUsage = {
  name: string;
  value: number;
  category?: string;
};

export type HourlyUsage = {
  name: string;
  usage: number;
};

export type DailyUsage = {
  name: string;
  [childName: string]: number | string;
};

export type UsageData = {
  hourlyData: HourlyUsage[];
  appUsageData: AppUsage[];
  weeklyData: DailyUsage[];
  monthlyData: DailyUsage[];
};

type ReportsContextType = {
  children: Child[];
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
  startDate: Date;
  endDate: Date;
  setDateRange: (start: Date, end: Date) => void;
  usageData: UsageData;
  isLoading: boolean;
  error: string | null;
};

const ReportsContext = createContext<ReportsContextType | null>(null);

// Mock data for when real data isn't available
const mockUsageData: UsageData = {
  hourlyData: [
    { name: "8AM", usage: 10 },
    { name: "9AM", usage: 15 },
    { name: "10AM", usage: 20 },
    { name: "11AM", usage: 25 },
    { name: "12PM", usage: 30 },
    { name: "1PM", usage: 35 },
    { name: "2PM", usage: 40 },
    { name: "3PM", usage: 45 },
    { name: "4PM", usage: 50 },
    { name: "5PM", usage: 55 },
    { name: "6PM", usage: 60 },
    { name: "7PM", usage: 50 },
    { name: "8PM", usage: 40 },
    { name: "9PM", usage: 20 },
  ],
  appUsageData: [
    { name: "Chrome", value: 35, category: "browser" },
    { name: "YouTube", value: 25, category: "video" },
    { name: "Minecraft", value: 20, category: "game" },
    { name: "Educational Apps", value: 15, category: "education" },
    { name: "Other", value: 5, category: "other" },
  ],
  weeklyData: [
    { name: "Mon", Emma: 120, Noah: 90, Sophia: 140 },
    { name: "Tue", Emma: 150, Noah: 100, Sophia: 130 },
    { name: "Wed", Emma: 180, Noah: 120, Sophia: 150 },
    { name: "Thu", Emma: 140, Noah: 80, Sophia: 120 },
    { name: "Fri", Emma: 160, Noah: 110, Sophia: 160 },
    { name: "Sat", Emma: 200, Noah: 150, Sophia: 180 },
    { name: "Sun", Emma: 190, Noah: 130, Sophia: 170 },
  ],
  monthlyData: [
    { name: "Week 1", Emma: 800, Noah: 600, Sophia: 900 },
    { name: "Week 2", Emma: 900, Noah: 650, Sophia: 850 },
    { name: "Week 3", Emma: 750, Noah: 500, Sophia: 800 },
    { name: "Week 4", Emma: 950, Noah: 700, Sophia: 950 },
  ],
};

// Mock children data if needed
const mockChildren: Child[] = [
  {
    id: "mock-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_id: "mock-parent",
    name: "Emma",
    age: 12,
    avatar_url: null,
    pin: null,
    daily_limit: 180,
    time_used: 120,
    status: "active",
    last_active: new Date().toISOString(),
    bedtime_start: "21:00",
    bedtime_end: "07:00",
    bedtime_enabled: true,
  },
  {
    id: "mock-2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_id: "mock-parent",
    name: "Noah",
    age: 9,
    avatar_url: null,
    pin: null,
    daily_limit: 120,
    time_used: 85,
    status: "active",
    last_active: new Date().toISOString(),
    bedtime_start: "20:00",
    bedtime_end: "07:30",
    bedtime_enabled: true,
  },
  {
    id: "mock-3",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    parent_id: "mock-parent",
    name: "Sophia",
    age: 14,
    avatar_url: null,
    pin: null,
    daily_limit: 240,
    time_used: 180,
    status: "offline",
    last_active: new Date(Date.now() - 3600000).toISOString(),
    bedtime_start: "22:00",
    bedtime_end: "06:30",
    bedtime_enabled: true,
  },
];

export function ReportsProvider({
  children: reactChildren,
}: {
  children: ReactNode;
}) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [usageData, setUsageData] = useState<UsageData>(mockUsageData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);

  const setDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Fetch children data
  useEffect(() => {
    const fetchChildren = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
          // If not authenticated, use mock data
          setUseMockData(true);
          setChildren(mockChildren);
          throw new Error("Not authenticated");
        }

        const userId = sessionData.session.user.id;

        // Fetch children for this parent
        const { data: childrenData, error: childrenError } = await supabase
          .from("children")
          .select("*")
          .eq("parent_id", userId)
          .order("name", { ascending: true });

        if (childrenError) throw childrenError;

        if (!childrenData || childrenData.length === 0) {
          // If no children found, use mock data
          setUseMockData(true);
          setChildren(mockChildren);
        } else {
          setChildren(childrenData);
        }
      } catch (err: any) {
        console.error("Error fetching children:", err);
        setError(err.message || "Failed to fetch children data");
        setUseMockData(true);
        setChildren(mockChildren);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // Fetch usage data based on selected child and date range
  useEffect(() => {
    const fetchUsageData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real app, you'd fetch data from Supabase based on child ID and date range
        // For this demo, we'll use mock data with a slight delay to simulate fetching
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, just set the mock data
        setUsageData(mockUsageData);
      } catch (err: any) {
        console.error("Error fetching usage data:", err);
        setError(err.message || "Failed to fetch usage data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsageData();
  }, [selectedChildId, startDate, endDate]);

  return (
    <ReportsContext.Provider
      value={{
        children,
        selectedChildId,
        setSelectedChildId,
        startDate,
        endDate,
        setDateRange,
        usageData,
        isLoading,
        error,
      }}
    >
      {reactChildren}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
