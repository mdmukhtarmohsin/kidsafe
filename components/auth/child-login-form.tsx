"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase-client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for child login validation
const childLoginSchema = z.object({
  deviceId: z.string().min(1, { message: "Device ID cannot be empty." }),
  pin: z.string().min(4, { message: "PIN must be at least 4 characters." }),
});

export function ChildLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Use react-hook-form
  const form = useForm<z.infer<typeof childLoginSchema>>({
    resolver: zodResolver(childLoginSchema),
    defaultValues: {
      deviceId: "",
      pin: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof childLoginSchema>) => {
    setIsLoading(true);
    const { deviceId, pin } = values;

    try {
      // Find the device by device_id
      const { data: deviceData, error: deviceError } = await supabase
        .from("devices")
        .select("*, children(*)")
        .eq("device_id", deviceId)
        .single();

      if (deviceError || !deviceData) {
        throw new Error("Device not found. Please check your Device ID.");
      }

      // Check if the PIN matches or if the child doesn't have a PIN
      const childPin = deviceData.children?.pin;
      if (childPin && childPin !== pin) {
        throw new Error("Invalid PIN. Please try again.");
      }

      // Update the device's last_active and is_active status
      const { error: updateError } = await supabase
        .from("devices")
        .update({
          last_active: new Date().toISOString(),
          is_active: true,
        })
        .eq("id", deviceData.id);

      if (updateError) {
        console.error("Error updating device status:", updateError);
      }

      // Store complete device and child data in localStorage for the dashboard
      localStorage.setItem("childDeviceData", JSON.stringify(deviceData));

      // Success message and redirect
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${deviceData.children.name}!`,
        variant: "default",
      });

      router.push("/child-dashboard");
    } catch (error: any) {
      console.error("Child Login Error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Child Login</CardTitle>
        <CardDescription>
          Enter your device ID and PIN to access your dashboard
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your device ID"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PIN</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your PIN"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm">
              <Link href="/login" className="text-primary hover:underline">
                Parent Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
