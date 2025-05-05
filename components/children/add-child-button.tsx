"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TablesInsert, Tables } from "@/lib/supabase-types";
import { v4 as uuidv4 } from "uuid";
import { seedMockDataForChild } from "@/lib/mock-utils";

// Zod schema from add-child-form
const addChildSchema = z.object({
  name: z.string().min(1, { message: "Child's name is required." }),
  age: z.coerce.number().int().positive().optional().or(z.literal("")),
  pin: z
    .string()
    .length(4, { message: "PIN must be 4 digits." })
    .regex(/^\d{4}$/, "PIN must be numeric.")
    .optional()
    .or(z.literal("")),
  daily_limit: z.coerce
    .number()
    .int()
    .min(0, "Daily limit cannot be negative.")
    .default(120),
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

export function AddChildButton() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addChildSchema>>({
    resolver: zodResolver(addChildSchema),
    defaultValues: {
      name: "",
      age: "",
      pin: "",
      daily_limit: 120,
      bedtime_enabled: true,
      bedtime_start: "21:00",
      bedtime_end: "07:00",
    },
  });

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      form.reset();
      setIsLoading(false);
    }
  }, [open, form]);

  // handleSubmit logic from add-child-form
  const handleSubmit = async (values: z.infer<typeof addChildSchema>) => {
    setIsLoading(true);
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error(sessionError?.message || "User not authenticated.");
      }
      const parent_id = session.user.id;

      const childData: TablesInsert<"children"> = {
        parent_id,
        name: values.name,
        daily_limit: values.daily_limit,
        bedtime_enabled: values.bedtime_enabled,
        bedtime_start: `${values.bedtime_start}:00`,
        bedtime_end: `${values.bedtime_end}:00`,
        ...(values.age && { age: Number(values.age) }),
        ...(values.pin && { pin: values.pin }),
      };

      // Insert child AND get the ID back
      const { data: newChildData, error: insertError } = await supabase
        .from("children")
        .insert(childData)
        .select("id") // Select the ID of the inserted row
        .single(); // Expecting a single row back

      if (insertError) {
        throw insertError;
      }
      if (!newChildData || !newChildData.id) {
        throw new Error("Failed to retrieve new child ID after insertion.");
      }

      const newChildId = newChildData.id;
      console.log(`New child created with ID: ${newChildId}`);

      // Seed mock data for this child
      await seedMockDataForChild(newChildId, values.name);

      toast({
        title: "Child Added Successfully!",
        description: `${values.name} has been added (with mock data).`,
        variant: "default",
      });

      // First close the modal
      setOpen(false);

      // Wait a brief moment to ensure modal is fully closed before navigation
      setTimeout(() => {
        // Then refresh the page
        router.push(`?refresh=${Date.now()}`);
      }, 500);
    } catch (error: any) {
      console.error("Add Child Error:", error);
      toast({
        title: "Failed to Add Child",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Child
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {" "}
        {/* Adjust width if needed */}
        <DialogHeader>
          <DialogTitle>Add a new child</DialogTitle>
          <DialogDescription>
            Create a new profile for your child to monitor their device usage.
          </DialogDescription>
        </DialogHeader>
        {/* Replace old div with the Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2 py-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Child's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Emma" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Age */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* PIN */}
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4-Digit PIN (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="1234"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Used for child login (if enabled).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Daily Limit */}
              <FormField
                control={form.control}
                name="daily_limit"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Daily Screen Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} required />
                    </FormControl>
                    <FormDescription>
                      Total minutes allowed per day.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Bedtime Settings Title */}
              <div className="sm:col-span-2 mt-4 border-t pt-4">
                <h3 className="text-md font-medium">Bedtime Schedule</h3>
                <p className="text-sm text-muted-foreground">
                  Restrict usage during specific hours.
                </p>
              </div>
              {/* Bedtime Enabled */}
              <FormField
                control={form.control}
                name="bedtime_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm sm:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel>Enable Bedtime</FormLabel>
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
              {/* Bedtime Start */}
              <FormField
                control={form.control}
                name="bedtime_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedtime Starts (HH:MM)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Bedtime End */}
              <FormField
                control={form.control}
                name="bedtime_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedtime Ends (HH:MM)</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding Child..." : "Add Child"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
