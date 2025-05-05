"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase-client";
import type { Database } from "@/lib/supabase-types";

// Types for our context
export type AlertType =
  | "inappropriate_content"
  | "time_limit"
  | "unknown_app"
  | "bedtime"
  | "location";

export interface Alert {
  id: string;
  created_at: string;
  parent_id: string;
  child_id: string;
  type: string;
  message: string;
  read: boolean;
  urgent: boolean;
}

export interface AlertSetting {
  id: string;
  alert_type: AlertType;
  enabled: boolean;
  email_notification: boolean;
  push_notification: boolean;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}

type AlertsContextType = {
  alerts: Alert[];
  alertSettings: AlertSetting[];
  unreadCount: number;
  markAsRead: (alertId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updateAlertSetting: (
    settingId: string,
    updates: Partial<AlertSetting>
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const AlertsContext = createContext<AlertsContextType | null>(null);

// Mock data for when real data isn't available
const mockAlerts: Alert[] = [
  {
    id: "mock-alert-1",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    parent_id: "mock-parent",
    child_id: "mock-1",
    type: "inappropriate_content",
    message:
      "Emma attempted to access restricted content in the 'Gaming' category",
    read: false,
    urgent: true,
  },
  {
    id: "mock-alert-2",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    parent_id: "mock-parent",
    child_id: "mock-2",
    type: "time_limit",
    message: "Noah has reached his daily screen time limit",
    read: false,
    urgent: false,
  },
  {
    id: "mock-alert-3",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    parent_id: "mock-parent",
    child_id: "mock-3",
    type: "unknown_app",
    message: "Sophia installed a new app: TikTok",
    read: true,
    urgent: false,
  },
  {
    id: "mock-alert-4",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    parent_id: "mock-parent",
    child_id: "mock-1",
    type: "bedtime",
    message: "Emma was using her device past bedtime",
    read: true,
    urgent: true,
  },
  {
    id: "mock-alert-5",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    parent_id: "mock-parent",
    child_id: "mock-2",
    type: "location",
    message: "Noah left the designated safe area",
    read: true,
    urgent: true,
  },
];

const mockAlertSettings: AlertSetting[] = [
  {
    id: "mock-setting-1",
    alert_type: "inappropriate_content",
    enabled: true,
    email_notification: true,
    push_notification: true,
  },
  {
    id: "mock-setting-2",
    alert_type: "time_limit",
    enabled: true,
    email_notification: false,
    push_notification: true,
  },
  {
    id: "mock-setting-3",
    alert_type: "unknown_app",
    enabled: true,
    email_notification: true,
    push_notification: true,
  },
  {
    id: "mock-setting-4",
    alert_type: "bedtime",
    enabled: true,
    email_notification: false,
    push_notification: true,
  },
  {
    id: "mock-setting-5",
    alert_type: "location",
    enabled: false,
    email_notification: false,
    push_notification: false,
  },
];

export function AlertsProvider({
  children: reactChildren,
}: {
  children: ReactNode;
}) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);

  // Fetch alerts and settings
  useEffect(() => {
    const fetchAlertsData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
          // If not authenticated, use mock data
          setUseMockData(true);
          setAlerts(mockAlerts);
          setAlertSettings(mockAlertSettings);
          setUnreadCount(mockAlerts.filter((alert) => !alert.read).length);
          throw new Error("Not authenticated");
        }

        const userId = sessionData.session.user.id;

        // Fetch alerts for this parent
        const { data: alertsData, error: alertsError } = await supabase
          .from("alerts")
          .select("*")
          .eq("parent_id", userId)
          .order("created_at", { ascending: false });

        if (alertsError) throw alertsError;

        // Fetch alert settings
        const { data: settingsData, error: settingsError } = await supabase
          .from("alert_settings")
          .select("*")
          .eq("parent_id", userId);

        if (settingsError) throw settingsError;

        // If no data found, use mock data
        if (
          !alertsData ||
          !settingsData ||
          alertsData.length === 0 ||
          settingsData.length === 0
        ) {
          setUseMockData(true);
          setAlerts(mockAlerts);
          setAlertSettings(mockAlertSettings);
          setUnreadCount(mockAlerts.filter((alert) => !alert.read).length);
        } else {
          setAlerts(alertsData as Alert[]);

          // Convert the alert_type from string to AlertType
          const typedSettings = settingsData.map((setting) => ({
            ...setting,
            alert_type: setting.alert_type as AlertType,
          }));

          setAlertSettings(typedSettings);
          setUnreadCount(alertsData.filter((alert) => !alert.read).length);
        }
      } catch (err: any) {
        console.error("Error fetching alerts data:", err);
        setError(err.message || "Failed to fetch alerts data");
        setUseMockData(true);
        setAlerts(mockAlerts);
        setAlertSettings(mockAlertSettings);
        setUnreadCount(mockAlerts.filter((alert) => !alert.read).length);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertsData();
  }, []);

  // Mark a single alert as read
  const markAsRead = async (alertId: string) => {
    try {
      if (useMockData) {
        // Update local state for mock data
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) =>
            alert.id === alertId ? { ...alert, read: true } : alert
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        return;
      }

      // Update in Supabase
      const { error } = await supabase
        .from("alerts")
        .update({ read: true })
        .eq("id", alertId);

      if (error) throw error;

      // Update local state
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error("Error marking alert as read:", err);
      throw new Error(err.message || "Failed to mark alert as read");
    }
  };

  // Mark all alerts as read
  const markAllAsRead = async () => {
    try {
      if (useMockData) {
        // Update local state for mock data
        setAlerts((prevAlerts) =>
          prevAlerts.map((alert) => ({ ...alert, read: true }))
        );
        setUnreadCount(0);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Not authenticated");

      const userId = sessionData.session.user.id;

      // Update in Supabase
      const { error } = await supabase
        .from("alerts")
        .update({ read: true })
        .eq("parent_id", userId)
        .eq("read", false);

      if (error) throw error;

      // Update local state
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) => ({ ...alert, read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error("Error marking all alerts as read:", err);
      throw new Error(err.message || "Failed to mark all alerts as read");
    }
  };

  // Update alert settings
  const updateAlertSetting = async (
    settingId: string,
    updates: Partial<AlertSetting>
  ) => {
    try {
      if (useMockData) {
        // Update local state for mock data
        setAlertSettings((prevSettings) =>
          prevSettings.map((setting) =>
            setting.id === settingId ? { ...setting, ...updates } : setting
          )
        );
        return;
      }

      // Update in Supabase
      const { error } = await supabase
        .from("alert_settings")
        .update(updates)
        .eq("id", settingId);

      if (error) throw error;

      // Update local state
      setAlertSettings((prevSettings) =>
        prevSettings.map((setting) =>
          setting.id === settingId ? { ...setting, ...updates } : setting
        )
      );
    } catch (err: any) {
      console.error("Error updating alert setting:", err);
      throw new Error(err.message || "Failed to update alert setting");
    }
  };

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        alertSettings,
        unreadCount,
        markAsRead,
        markAllAsRead,
        updateAlertSetting,
        isLoading,
        error,
      }}
    >
      {reactChildren}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return context;
}
