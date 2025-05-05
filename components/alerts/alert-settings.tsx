"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Bell,
  AlertTriangle,
  Shield,
  Clock,
  Smartphone,
  EyeOff,
  MapPin,
  Mail,
} from "lucide-react";
import { useAlerts, AlertType } from "./alerts-context";

export function AlertSettings() {
  const { alertSettings, updateAlertSetting, isLoading, error } = useAlerts();
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
                <Skeleton className="h-px w-full mt-2" />
              </div>
            ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading alert settings</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Get the display name and icon for an alert type
  const getAlertTypeInfo = (type: AlertType) => {
    switch (type) {
      case "inappropriate_content":
        return {
          name: "Inappropriate Content",
          description:
            "Get alerted when your child attempts to access restricted content",
          icon: <Shield className="h-5 w-5 text-red-500" />,
        };
      case "time_limit":
        return {
          name: "Screen Time Limit",
          description:
            "Get alerted when your child reaches their daily screen time limit",
          icon: <Clock className="h-5 w-5 text-amber-500" />,
        };
      case "unknown_app":
        return {
          name: "New App Installation",
          description: "Get alerted when your child installs a new application",
          icon: <Smartphone className="h-5 w-5 text-blue-500" />,
        };
      case "bedtime":
        return {
          name: "Bedtime Violation",
          description:
            "Get alerted if your child uses their device during bedtime hours",
          icon: <EyeOff className="h-5 w-5 text-indigo-500" />,
        };
      case "location":
        return {
          name: "Location Alert",
          description:
            "Get alerted when your child leaves designated safe areas",
          icon: <MapPin className="h-5 w-5 text-green-500" />,
        };
      default:
        return {
          name: "Alert",
          description: "Notification settings",
          icon: <Bell className="h-5 w-5 text-gray-500" />,
        };
    }
  };

  const handleToggle = async (
    settingId: string,
    field: keyof (typeof alertSettings)[0],
    value: boolean
  ) => {
    setUpdating((prev) => ({ ...prev, [`${settingId}-${field}`]: true }));

    try {
      await updateAlertSetting(settingId, { [field]: value } as any);
    } catch (err) {
      console.error(`Failed to update ${field} for setting ${settingId}:`, err);
    } finally {
      setUpdating((prev) => ({ ...prev, [`${settingId}-${field}`]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alert Notifications
        </CardTitle>
        <CardDescription>
          Configure which alerts you want to receive and how
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {alertSettings.map((setting) => {
          const { name, description, icon } = getAlertTypeInfo(
            setting.alert_type as AlertType
          );
          const enabledKey = `${setting.id}-enabled`;
          const emailKey = `${setting.id}-email_notification`;
          const pushKey = `${setting.id}-push_notification`;

          return (
            <div key={setting.id} className="space-y-4">
              <div className="flex items-center gap-2">
                {icon}
                <h3 className="font-medium">{name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={enabledKey} className="text-sm">
                      Enable alerts
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                  <Switch
                    id={enabledKey}
                    checked={setting.enabled}
                    disabled={updating[enabledKey]}
                    onCheckedChange={(checked) =>
                      handleToggle(setting.id, "enabled", checked)
                    }
                  />
                </div>

                {setting.enabled && (
                  <>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={emailKey} className="text-sm">
                          Email notifications
                        </Label>
                      </div>
                      <Switch
                        id={emailKey}
                        checked={setting.email_notification}
                        disabled={updating[emailKey] || !setting.enabled}
                        onCheckedChange={(checked) =>
                          handleToggle(
                            setting.id,
                            "email_notification",
                            checked
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={pushKey} className="text-sm">
                          Push notifications
                        </Label>
                      </div>
                      <Switch
                        id={pushKey}
                        checked={setting.push_notification}
                        disabled={updating[pushKey] || !setting.enabled}
                        onCheckedChange={(checked) =>
                          handleToggle(setting.id, "push_notification", checked)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <Separator />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
