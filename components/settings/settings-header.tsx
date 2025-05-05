"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "./settings-context";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export function SettingsHeader() {
  const { userProfile, isLoading, isSaving } = useSettings();
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSyncSettings = async () => {
    try {
      setIsSyncing(true);
      // Simulate syncing with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Settings Synced",
        description: "Your settings have been synchronized successfully.",
      });
    } catch (err) {
      toast({
        title: "Sync Failed",
        description: "There was a problem synchronizing your settings.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Settings className="h-6 w-6 text-muted-foreground" />
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-48 mt-1" />
        ) : (
          <p className="text-muted-foreground">
            Manage your preferences and account settings
            {userProfile ? `, ${userProfile.name.split(" ")[0]}` : ""}
          </p>
        )}
      </div>
      <Button
        variant="outline"
        onClick={handleSyncSettings}
        disabled={isLoading || isSaving || isSyncing}
      >
        {isSyncing ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Syncing...
          </>
        ) : (
          <>
            {isSaving ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Settings
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
}
