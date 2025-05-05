"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-client";
import type { TablesInsert } from "@/lib/supabase-types";
import { seedMockDataForChild } from "@/lib/mock-utils";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { TestTubeDiagonal } from "lucide-react";

// Simple random data generators
const randomNames = [
  "Alex",
  "Jamie",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Skyler",
];
const getRandomName = () =>
  randomNames[Math.floor(Math.random() * randomNames.length)];
const getRandomAge = () => Math.floor(Math.random() * 10) + 6; // Age 6-15
const getRandomLimit = () => Math.floor(Math.random() * 8 + 1) * 30; // 30 - 240 mins, steps of 30

export function GenerateDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // 1. Get parent ID
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error(sessionError?.message || "User not authenticated.");
      }
      const parent_id = session.user.id;

      // 2. Generate random child data
      const name = getRandomName();
      const age = getRandomAge();
      const daily_limit = getRandomLimit();

      const childData: TablesInsert<"children"> = {
        parent_id,
        name,
        age,
        daily_limit,
        bedtime_enabled: Math.random() > 0.2, // 80% chance enabled
        bedtime_start: "21:00:00", // Keep fixed for simplicity
        bedtime_end: "07:00:00", // Keep fixed for simplicity
        // pin: null, // No PIN for generated users for now
        // avatar_url: null
      };

      // 3. Insert new child
      const { data: newChildData, error: insertError } = await supabase
        .from("children")
        .insert(childData)
        .select("id")
        .single();

      if (insertError) throw insertError;
      if (!newChildData || !newChildData.id)
        throw new Error("Failed to get new child ID.");

      const newChildId = newChildData.id;

      // 4. Seed related mock data
      await seedMockDataForChild(newChildId, name);

      toast({
        title: "Generated Child Data",
        description: `Successfully created random profile for ${name}.`,
        variant: "default",
      });

      // Add a timestamp to the refresh parameter to make it unique each time
      router.push(`?refresh=${Date.now()}`);
    } catch (error: any) {
      console.error("Generate Data Error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate random child data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleGenerate} disabled={isLoading}>
      <TestTubeDiagonal className="mr-2 h-4 w-4" />
      {isLoading ? "Generating..." : "Generate Random Child"}
    </Button>
  );
}
