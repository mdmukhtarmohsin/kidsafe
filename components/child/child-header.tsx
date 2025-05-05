"use client";

import { Button } from "@/components/ui/button";
import { LogOut, User, Star } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
          <User className="h-7 w-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Hello, {childName}!
            </h1>
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-muted-foreground">
            {deviceData?.device_name ? (
              <span className="flex items-center">
                Connected from{" "}
                <span className="font-medium text-blue-600 ml-1">
                  {deviceData.device_name}
                </span>
              </span>
            ) : (
              "Here's your screen time for today"
            )}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="rounded-full px-4 border-2 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
}
