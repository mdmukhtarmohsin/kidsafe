"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import type { Tables } from "@/lib/supabase-types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert as UiAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { format } from "date-fns";

interface ChildProfileProps {
  id: string;
}

type Child = Tables<"children">;

export function ChildProfile({ id }: ChildProfileProps) {
  const [child, setChild] = useState<Child | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch child data
  useEffect(() => {
    const fetchChild = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from("children")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        if (!data) throw new Error("Child not found.");

        setChild(data);
      } catch (err: any) {
        console.error("Error fetching child profile:", err);
        setError(err.message || "Failed to load profile.");
        setChild(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchChild();
    }
  }, [id]);

  // Render Loading State
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Error State
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <UiAlert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Failed to Load Profile</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </UiAlert>
        </CardContent>
      </Card>
    );
  }

  // Render Profile Data
  if (!child) {
    return (
      <Card>
        <CardContent>Child data not available.</CardContent>
      </Card>
    );
  }

  // Original simple display structure (adapted for real data)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          View your child's profile details.
        </CardDescription>{" "}
        {/* Changed description */}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="h-20 w-20">
            {child.avatar_url && (
              <AvatarImage src={child.avatar_url} alt={child.name} />
            )}
            <AvatarFallback className="text-2xl">
              {child.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold">{child.name}</h3>
            <p className="text-muted-foreground">
              {child.age ? `${child.age} years old` : "Age not set"}
            </p>
            <p className="text-xs text-muted-foreground">
              Added on {format(new Date(child.created_at), "PPP")}
            </p>
          </div>
        </div>
        {/* Display fields as read-only for now */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name-display">Name</Label>
            <Input id="name-display" value={child.name} readOnly disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age-display">Age</Label>
            <Input
              id="age-display"
              type="number"
              value={child.age || ""}
              readOnly
              disabled
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pin-display">PIN</Label>
            <Input
              id="pin-display"
              value={child.pin || "Not Set"}
              readOnly
              disabled
            />
          </div>
          <p className="text-sm text-muted-foreground text-center pt-4">
            Profile editing coming soon.
          </p>
          {/* <Button className="w-full" disabled>Save Changes</Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
