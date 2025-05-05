"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Terminal } from "lucide-react";
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
});

interface TimeSettingsProps {
  id: string;
}

export function TimeSettings({ id }: TimeSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof timeSettingsSchema>>({
    resolver: zodResolver(timeSettingsSchema),
    defaultValues: {
      daily_limit: 120, // Default value
      bedtime_enabled: true,
      bedtime_start: "21:00",
      bedtime_end: "07:00",
    },
  });

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
        });
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
        description: "Child's time limits have been saved.",
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
        <CardTitle>Time Limits & Schedule</CardTitle>
        <CardDescription>
          Set daily screen time limits and bedtime hours.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <CardContent className="space-y-6">
            {/* Daily Limit Slider */}
            <FormField
              control={form.control}
              name="daily_limit"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel>Daily Screen Time Limit</FormLabel>
                    <span className="text-sm font-medium">
                      {Math.floor(watchedDailyLimit / 60)}h{" "}
                      {watchedDailyLimit % 60}m
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={720} // 12 hours max for slider simplicity?
                      step={15}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Total screen time allowed per day (in minutes).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bedtime Enabled Switch */}
            <FormField
              control={form.control}
              name="bedtime_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Bedtime Mode</FormLabel>
                    <FormDescription>
                      Restrict usage during specific hours.
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

            {/* Bedtime Start/End Inputs */}
            <div
              className={`grid grid-cols-2 gap-4 ${
                !watchedBedtimeEnabled ? "opacity-50" : ""
              }`}
            >
              <FormField
                control={form.control}
                name="bedtime_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedtime Starts</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        required
                        disabled={!watchedBedtimeEnabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedtime_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedtime Ends</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        required
                        disabled={!watchedBedtimeEnabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSaving || !form.formState.isDirty}
            >
              {isSaving ? "Saving..." : "Save Time Settings"}
            </Button>
            {!form.formState.isDirty && form.formState.isSubmitted && (
              <p className="text-sm text-muted-foreground text-center">
                No changes to save.
              </p>
            )}
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
