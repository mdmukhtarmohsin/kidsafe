"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChildHeaderProps {
  childName?: string;
}

export function ChildHeader({ childName = "there" }: ChildHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Remove local storage items
    localStorage.removeItem("childId");
    localStorage.removeItem("deviceId");
    localStorage.removeItem("childName");
    router.push("/child-login");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Hello, {childName}!</h1>
        <p className="text-muted-foreground">
          Here's your screen time for today
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
}
