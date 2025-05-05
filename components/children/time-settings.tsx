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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert as UiAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Terminal,
  Clock,
  Calendar,
  AlertCircle,
  Timer,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import type { Tables, TablesUpdate } from "@/lib/supabase-types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Zod schema for time settings validation
const timeSettingsSchema = z.object({
  daily_limit: z
    .number()
    .int()
    .min(0, "Daily limit cannot be negative.")
    .max(1440, "Limit cannot exceed 24 hours"), // Max 24 hours in minutes
  bedtime_enabled: z.boolean().default(true),
  bedtime_start: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
    .default("21:00"),
  bedtime_end: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
    .default("07:00"),
  schedule_enabled: z.boolean().default(false),
  scheduled_days: z.array(z.string()).default([]),
});

interface TimeSettingsProps {
  id: string;
}

type Schedule = {
  day: string;
  label: string;
  allowed: boolean;
};

export function TimeSettings({ id }: TimeSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("daily");
  const [weeklySchedule, setWeeklySchedule] = useState<Schedule[]>([
    { day: "monday", label: "Monday", allowed: true },
    { day: "tuesday", label: "Tuesday", allowed: true },
    { day: "wednesday", label: "Wednesday", allowed: true },
    { day: "thursday", label: "Thursday", allowed: true },
    { day: "friday", label: "Friday", allowed: true },
    { day: "saturday", label: "Saturday", allowed: true },
    { day: "sunday", label: "Sunday", allowed: true },
  ]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof timeSettingsSchema>>({
    resolver: zodResolver(timeSettingsSchema),
    defaultValues: {
      daily_limit: 120, // Default value
      bedtime_enabled: true,
      bedtime_start: "21:00",
      bedtime_end: "07:00",
      schedule_enabled: false,
      scheduled_days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  });

  // Format minutes to display nicely
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} minutes`;
    if (mins === 0) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    return `${hours}h ${mins}m`;
  };

  // Toggle day in schedule
  const toggleDay = (day: string) => {
    setWeeklySchedule((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, allowed: !item.allowed } : item
      )
    );

    // Update form value
    const currentDays = form.getValues().scheduled_days;
    const dayExists = currentDays.includes(day);

    if (dayExists) {
      form.setValue(
        "scheduled_days",
        currentDays.filter((d) => d !== day)
      );
    } else {
      form.setValue("scheduled_days", [...currentDays, day]);
    }
  };

  // Fetch initial time settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("children")
          .select("daily_limit, bedtime_enabled, bedtime_start, bedtime_end")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Child settings not found.");

        // Set form values once data is fetched
        form.reset({
          daily_limit: data.daily_limit,
          bedtime_enabled: data.bedtime_enabled ?? true, // Default to true if null
          // Format TIME string (HH:MM:SS) to HH:MM for input type="time"
          bedtime_start: data.bedtime_start?.substring(0, 5) || "21:00",
          bedtime_end: data.bedtime_end?.substring(0, 5) || "07:00",
          schedule_enabled: false, // Default value, update when added to database
          scheduled_days: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
          ], // Default value
        });

        // Set mock schedule days (in a real app, this would come from the database)
        setWeeklySchedule((prev) =>
          prev.map((day) => ({
            ...day,
            allowed: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
            ].includes(day.day),
          }))
        );
      } catch (err: any) {
        console.error("Error fetching time settings:", err);
        setError(err.message || "Failed to load time settings.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Handle form submission
  const handleSave = async (values: z.infer<typeof timeSettingsSchema>) => {
    setIsSaving(true);
    try {
      const updateData: TablesUpdate<"children"> = {
        daily_limit: values.daily_limit,
        bedtime_enabled: values.bedtime_enabled,
        bedtime_start: `${values.bedtime_start}:00`, // Add seconds back for DB
        bedtime_end: `${values.bedtime_end}:00`, // Add seconds back for DB
      };

      const { error: updateError } = await supabase
        .from("children")
        .update(updateData)
        .eq("id", id);

      if (updateError) throw updateError;

      toast({
        title: "Time Settings Updated",
        description: "Child's time limits have been saved successfully.",
        variant: "default",
      });
      form.reset(values); // Update form state to reset dirty status
      router.refresh(); // Refresh server components
    } catch (err: any) {
      console.error("Error saving time settings:", err);
      toast({
        title: "Save Failed",
        description: err.message || "Could not save time settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Watch values for displaying slider label
  const watchedDailyLimit = form.watch("daily_limit");
  const watchedBedtimeEnabled = form.watch("bedtime_enabled");
  const watchedScheduleEnabled = form.watch("schedule_enabled");

  // Loading State
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <UiAlert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Failed to Load Settings</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </UiAlert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Time Limits & Schedule
              {form.formState.isDirty && (
                <Badge
                  variant="outline"
                  className="ml-2 text-amber-500 bg-amber-50 border-amber-200"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unsaved changes
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Set daily screen time limits and bedtime hours
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <Tabs
            defaultValue="daily"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="daily"
                  className="flex items-center gap-1.5"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Daily Limits
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Weekly Schedule
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="pt-6">
              <TabsContent value="daily" className="space-y-6 mt-0">
                {/* Daily Limit Slider */}
                <FormField
                  control={form.control}
                  name="daily_limit"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-base flex items-center gap-1.5">
                          <Timer className="h-4 w-4 text-blue-500" />
                          Daily Screen Time Limit
                        </FormLabel>
                        <div className="flex items-center">
                          <span className="text-sm font-medium bg-blue-50 text-blue-700 py-1 px-2 rounded-md">
                            {formatTime(watchedDailyLimit)}
                          </span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-1"
                              >
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">
                                  About daily limits
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 text-sm" side="top">
                              <div className="space-y-2">
                                <h4 className="font-medium">
                                  About Daily Limits
                                </h4>
                                <p className="text-muted-foreground text-xs">
                                  This setting controls the total amount of
                                  screen time your child is allowed each day.
                                  Once the limit is reached, the device will be
                                  locked automatically.
                                </p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <FormControl>
                        <div className="pt-2">
                          <Slider
                            min={0}
                            max={720} // 12 hours max for slider simplicity
                            step={15}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="mt-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0h</span>
                            <span>4h</span>
                            <span>8h</span>
                            <span>12h</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Total screen time allowed per day across all devices
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Bedtime Enabled Switch */}
                <FormField
                  control={form.control}
                  name="bedtime_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Bedtime Mode
                        </FormLabel>
                        <FormDescription>
                          Restrict device usage during sleeping hours
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Bedtime Hours (only show if bedtime is enabled) */}
                {watchedBedtimeEnabled && (
                  <div className="rounded-lg border p-4 space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-500" />
                      Bedtime Hours
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bedtime_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Starts at</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription>
                              Devices will lock at this time
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bedtime_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ends at</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription>
                              Devices will unlock at this time
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6 mt-0">
                <FormField
                  control={form.control}
                  name="schedule_enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Weekly Schedule
                        </FormLabel>
                        <FormDescription>
                          Restrict access on specific days of the week
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {watchedScheduleEnabled && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="scheduled_days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-green-500" />
                            Device Access Schedule
                          </FormLabel>
                          <FormDescription className="mb-2">
                            Select which days your child can use their devices
                          </FormDescription>
                          <FormControl>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                              {weeklySchedule.map((day) => (
                                <Button
                                  key={day.day}
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    "border-2",
                                    day.allowed
                                      ? "border-green-200 bg-green-50"
                                      : "border-gray-200 bg-gray-50"
                                  )}
                                  onClick={() => toggleDay(day.day)}
                                >
                                  <div className="flex flex-col items-center">
                                    {day.allowed ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mb-1" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-gray-400 mb-1" />
                                    )}
                                    <span className="text-xs">{day.label}</span>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="rounded-lg border p-4 space-y-4">
                      <h4 className="text-sm font-medium">
                        Per-Day Time Limits
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Set different time limits for specific days (coming
                        soon)
                      </p>
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Use the same daily limit for all days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same">
                            Use the same daily limit for all days
                          </SelectItem>
                          <SelectItem value="custom">
                            Set custom limits for each day
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>

          <CardFooter className="flex justify-between border-t p-6">
            <Button
              variant="outline"
              onClick={() => {
                form.reset();
                setActiveTab("daily");
              }}
              disabled={!form.formState.isDirty || isSaving}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isSaving}
              className="gap-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
