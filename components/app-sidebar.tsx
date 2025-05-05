"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  Clock,
  Home,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
    router.push("/login");
  };

  // Skip sidebar for auth pages
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/child-login"
  ) {
    return null;
  }

  // Show simplified sidebar for child dashboard
  if (pathname === "/child-dashboard") {
    return (
      <Sidebar>
        <SidebarHeader className="flex items-center px-4 py-2">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">
            KidSafe
          </span>
        </SidebarHeader>
        <SidebarContent className="pl-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={true}>
                <Link href="/child-dashboard">
                  <Clock />
                  <span>Time Remaining</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild onClick={handleLogout}>
                <button>
                  <LogOut />
                  <span>Log Out</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  }

  // Full sidebar for parent dashboard
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center px-4 py-2">
        <Logo className="h-8 w-8" />
        <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">
          KidSafe
        </span>
      </SidebarHeader>
      <SidebarContent className="pl-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard"}
              className="px-2"
            >
              <Link href="/dashboard">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/children")}
            >
              <Link href="/children">
                <Users />
                <span>Children</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/reports"}>
              <Link href="/reports">
                <BarChart3 />
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/alerts"}>
              <Link href="/alerts">
                <Bell />
                <span>Alerts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <SidebarTrigger />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={handleLogout}>
              <button>
                <LogOut />
                <span>Log Out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
