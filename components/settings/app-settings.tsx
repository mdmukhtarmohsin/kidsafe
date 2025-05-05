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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  SunMoon,
  Languages,
  MapPin,
  BarChart,
  Lock,
  AlertTriangle,
  Save,
} from "lucide-react";
import { useSettings } from "./settings-context";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
];

export function AppSettings() {
  const { appPreferences, updateAppPreferences, isLoading, isSaving, error } =
    useSettings();
  const { toast } = useToast();
  const [localPrefs, setLocalPrefs] = useState(appPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize local state when preferences are loaded
  useEffect(() => {
    if (appPreferences) {
      setLocalPrefs(appPreferences);
    }
  }, [appPreferences]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <div className="flex space-x-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setLocalPrefs((prev) => {
      const newPrefs = { ...prev, theme: value };
      setHasChanges(true);
      return newPrefs;
    });
  };

  const handleLanguageChange = (value: string) => {
    setLocalPrefs((prev) => {
      const newPrefs = { ...prev, language: value };
      setHasChanges(true);
      return newPrefs;
    });
  };

  const handleToggle = (field: keyof typeof appPreferences) => {
    setLocalPrefs((prev) => {
      const newPrefs = { ...prev, [field]: !prev[field] };
      setHasChanges(true);
      return newPrefs;
    });
  };

  const handleSave = async () => {
    try {
      await updateAppPreferences(localPrefs);
      setHasChanges(false);
      toast({
        title: "Preferences Saved",
        description: "Your application settings have been updated.",
      });
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "There was a problem updating your application settings.",
        variant: "destructive",
      });
    }
  };

  const getLanguageLabel = (value: string) => {
    return LANGUAGES.find((lang) => lang.value === value)?.label || value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Application Settings
        </CardTitle>
        <CardDescription>
          Customize how the application works for you
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
          <div>
            <Label className="text-base flex items-center gap-2 mb-3">
              <SunMoon className="h-4 w-4" />
              Theme Preference
            </Label>
            <RadioGroup
              value={localPrefs.theme}
              onValueChange={(value) =>
                handleThemeChange(value as "light" | "dark" | "system")
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="light"
                  id="theme-light"
                  disabled={isSaving}
                />
                <Label htmlFor="theme-light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="dark"
                  id="theme-dark"
                  disabled={isSaving}
                />
                <Label htmlFor="theme-dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="system"
                  id="theme-system"
                  disabled={isSaving}
                />
                <Label htmlFor="theme-system">System</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label
              className="text-base flex items-center gap-2"
              htmlFor="language"
            >
              <Languages className="h-4 w-4" />
              Language
            </Label>
            <Select
              value={localPrefs.language}
              onValueChange={handleLanguageChange}
              disabled={isSaving}
            >
              <SelectTrigger id="language">
                <SelectValue
                  placeholder={getLanguageLabel(localPrefs.language)}
                />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Tracking
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable location tracking for your children's devices
              </p>
            </div>
            <Switch
              checked={localPrefs.enable_location_tracking}
              onCheckedChange={() => handleToggle("enable_location_tracking")}
              disabled={isSaving}
            />
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Anonymous Analytics
              </Label>
              <p className="text-sm text-muted-foreground">
                Help us improve by sharing anonymous usage data
              </p>
            </div>
            <Switch
              checked={localPrefs.allow_anonymous_analytics}
              onCheckedChange={() => handleToggle("allow_anonymous_analytics")}
              disabled={isSaving}
            />
          </div>

          <Separator className="my-4" />

          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Require Password for Settings
              </Label>
              <p className="text-sm text-muted-foreground">
                Require authentication to change app settings
              </p>
            </div>
            <Switch
              checked={localPrefs.require_password_for_settings}
              onCheckedChange={() =>
                handleToggle("require_password_for_settings")
              }
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
