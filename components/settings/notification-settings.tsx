"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  Mail,
  AlertTriangle,
  Calendar,
  Activity,
  AlignJustify,
  Save,
} from "lucide-react";
import { useSettings } from "./settings-context";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

export function NotificationSettings() {
  const {
    notificationPreferences,
    updateNotificationPreferences,
    isLoading,
    isSaving,
    error,
  } = useSettings();

  const { toast } = useToast();
  const [localPrefs, setLocalPrefs] = useState(notificationPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local state when preferences are loaded
  useEffect(() => {
    if (notificationPreferences) {
      setLocalPrefs(notificationPreferences);
    }
  }, [notificationPreferences]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                {i < 4 && <Skeleton className="h-px w-full mt-4" />}
              </div>
            ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  const handleToggle = (field: keyof typeof notificationPreferences) => {
    setLocalPrefs((prev) => {
      const newPrefs = { ...prev, [field]: !prev[field] };
      setHasChanges(true);
      return newPrefs;
    });
  };

  const handleSave = async () => {
    try {
      await updateNotificationPreferences(localPrefs);
      setHasChanges(false);
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (err) {
      toast({
        title: "Save Failed",
        description:
          "There was a problem updating your notification preferences.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your devices
              </p>
            </div>
            <Switch
              checked={localPrefs.push_alerts}
              onCheckedChange={() => handleToggle("push_alerts")}
              disabled={isSaving}
            />
          </div>
          <Separator />

          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts and notifications via email
              </p>
            </div>
            <Switch
              checked={localPrefs.email_alerts}
              onCheckedChange={() => handleToggle("email_alerts")}
              disabled={isSaving}
            />
          </div>
          <Separator />

          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Weekly Report
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of all children's activities
              </p>
            </div>
            <Switch
              checked={localPrefs.weekly_report}
              onCheckedChange={() => handleToggle("weekly_report")}
              disabled={isSaving}
            />
          </div>
          <Separator />

          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Daily Activity Summary
              </Label>
              <p className="text-sm text-muted-foreground">
                Get a daily summary of each child's device usage
              </p>
            </div>
            <Switch
              checked={localPrefs.child_activity_summary}
              onCheckedChange={() => handleToggle("child_activity_summary")}
              disabled={isSaving}
            />
          </div>
          <Separator />

          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <AlignJustify className="h-4 w-4" />
                Marketing Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and promotions
              </p>
            </div>
            <Switch
              checked={localPrefs.marketing_updates}
              onCheckedChange={() => handleToggle("marketing_updates")}
              disabled={isSaving}
            />
          </div>
        </div>
      </CardContent>
      {hasChanges && (
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
