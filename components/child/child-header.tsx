"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChildDevice {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  os_type: string;
  last_active: string | null;
  is_active: boolean;
  children: {
    id: string;
    name: string;
    age: number | null;
    [key: string]: any;
  };
  [key: string]: any;
}

interface ChildHeaderProps {
  childName?: string;
  deviceData?: ChildDevice;
}

export function ChildHeader({
  childName = "there",
  deviceData,
}: ChildHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Remove device data from localStorage
    localStorage.removeItem("childDeviceData");
    router.push("/child-login");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Hello, {childName}!</h1>
        <p className="text-muted-foreground">
          {deviceData?.device_name
            ? `Connected from ${deviceData.device_name}`
            : "Here's your screen time for today"}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
}
