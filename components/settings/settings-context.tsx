"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase-client";

// Types for our context
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  phone_number: string | null;
  created_at: string;
}

export interface NotificationPreference {
  email_alerts: boolean;
  push_alerts: boolean;
  weekly_report: boolean;
  child_activity_summary: boolean;
  marketing_updates: boolean;
}

export interface AppPreference {
  theme: "light" | "dark" | "system";
  language: string;
  enable_location_tracking: boolean;
  allow_anonymous_analytics: boolean;
  require_password_for_settings: boolean;
}

type SettingsContextType = {
  userProfile: UserProfile | null;
  notificationPreferences: NotificationPreference;
  appPreferences: AppPreference;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateNotificationPreferences: (
    updates: Partial<NotificationPreference>
  ) => Promise<void>;
  updateAppPreferences: (updates: Partial<AppPreference>) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

// Mock data
const mockUserProfile: UserProfile = {
  id: "mock-user-1",
  email: "parent@example.com",
  name: "Alex Parker",
  avatar_url: null,
  phone_number: "+1 (555) 123-4567",
  created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
};

const mockNotificationPreferences: NotificationPreference = {
  email_alerts: true,
  push_alerts: true,
  weekly_report: true,
  child_activity_summary: true,
  marketing_updates: false,
};

const mockAppPreferences: AppPreference = {
  theme: "system",
  language: "en",
  enable_location_tracking: true,
  allow_anonymous_analytics: true,
  require_password_for_settings: false,
};

export function SettingsProvider({
  children: reactChildren,
}: {
  children: ReactNode;
}) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [notificationPreferences, setNotificationPreferences] =
    useState<NotificationPreference>(mockNotificationPreferences);
  const [appPreferences, setAppPreferences] =
    useState<AppPreference>(mockAppPreferences);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);

  // Fetch user data and preferences
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!sessionData.session) {
          // If not authenticated, use mock data
          setUseMockData(true);
          setUserProfile(mockUserProfile);
          setNotificationPreferences(mockNotificationPreferences);
          setAppPreferences(mockAppPreferences);
          throw new Error("Not authenticated");
        }

        const userId = sessionData.session.user.id;

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from("parents")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileError) throw profileError;

        if (!profileData) {
          setUseMockData(true);
          setUserProfile(mockUserProfile);
        } else {
          // Transform real profile data to match our UserProfile type
          const userProfileData: UserProfile = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.name,
            avatar_url: profileData.avatar_url,
            phone_number: profileData.phone_number,
            created_at: profileData.created_at,
          };

          setUserProfile(userProfileData);

          // Extract notification preferences from the profile data
          // In a real app, this might be stored in a separate table or as JSON in the profile
          if (profileData.notification_preferences) {
            try {
              const notifPrefs =
                typeof profileData.notification_preferences === "string"
                  ? JSON.parse(profileData.notification_preferences)
                  : profileData.notification_preferences;

              setNotificationPreferences({
                ...mockNotificationPreferences, // Default values
                ...notifPrefs, // Overwrite with real values if they exist
              });
            } catch (e) {
              console.error("Error parsing notification preferences:", e);
              setNotificationPreferences(mockNotificationPreferences);
            }
          } else {
            setNotificationPreferences(mockNotificationPreferences);
          }
        }

        // For app preferences, we'll use mock data as this might be stored in local storage
        // in a real app rather than the database
        setAppPreferences(mockAppPreferences);
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to fetch user data");
        setUseMockData(true);
        setUserProfile(mockUserProfile);
        setNotificationPreferences(mockNotificationPreferences);
        setAppPreferences(mockAppPreferences);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setIsSaving(true);
      setError(null);

      if (useMockData) {
        // Update local state for mock data
        setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
        return;
      }

      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Not authenticated");

      const userId = sessionData.session.user.id;

      // Update email through auth if it's being updated
      if (updates.email && updates.email !== userProfile?.email) {
        const { error: updateEmailError } = await supabase.auth.updateUser({
          email: updates.email,
        });

        if (updateEmailError) throw updateEmailError;
      }

      // Update profile in database
      const { error: updateProfileError } = await supabase
        .from("parents")
        .update({
          name: updates.name,
          avatar_url: updates.avatar_url,
          phone_number: updates.phone_number,
        })
        .eq("id", userId);

      if (updateProfileError) throw updateProfileError;

      // Update local state
      setUserProfile((prev) => (prev ? { ...prev, ...updates } : null));
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
      throw new Error(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Update notification preferences
  const updateNotificationPreferences = async (
    updates: Partial<NotificationPreference>
  ) => {
    try {
      setIsSaving(true);
      setError(null);

      if (useMockData) {
        // Update local state for mock data
        setNotificationPreferences((prev) => ({ ...prev, ...updates }));
        return;
      }

      // Get current user
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Not authenticated");

      const userId = sessionData.session.user.id;

      // Get current preferences
      const updatedPreferences = { ...notificationPreferences, ...updates };

      // Update preferences in database
      const { error: updatePrefError } = await supabase
        .from("parents")
        .update({
          notification_preferences: updatedPreferences,
        })
        .eq("id", userId);

      if (updatePrefError) throw updatePrefError;

      // Update local state
      setNotificationPreferences(updatedPreferences);
    } catch (err: any) {
      console.error("Error updating notification preferences:", err);
      setError(err.message || "Failed to update notification preferences");
      throw new Error(
        err.message || "Failed to update notification preferences"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update app preferences
  const updateAppPreferences = async (updates: Partial<AppPreference>) => {
    try {
      setIsSaving(true);
      setError(null);

      // Update local state
      setAppPreferences((prev) => ({ ...prev, ...updates }));

      // In a real app, this might be saved to local storage or a user_settings table
      // For this demo, we'll just update the state

      // Simulate API delay
      if (!useMockData) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (err: any) {
      console.error("Error updating app preferences:", err);
      setError(err.message || "Failed to update app preferences");
      throw new Error(err.message || "Failed to update app preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        userProfile,
        notificationPreferences,
        appPreferences,
        updateProfile,
        updateNotificationPreferences,
        updateAppPreferences,
        isLoading,
        isSaving,
        error,
      }}
    >
      {reactChildren}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
