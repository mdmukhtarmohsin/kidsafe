import { ChildProfile } from "@/components/children/child-profile";
import { UsageStats } from "@/components/children/usage-stats";
import { TimeSettings } from "@/components/children/time-settings";
import { ContentRules } from "@/components/children/content-rules";
import { BackButton } from "@/components/ui/back-button";
import {
  Clock,
  ShieldCheck,
  ActivitySquare,
  User,
  Settings2,
  Laptop,
  Bell,
  AlertTriangle,
  Clock3,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format, subMinutes, subHours, subDays } from "date-fns";

// Mock alert data
const mockAlerts = [
  {
    id: "1",
    type: "time_limit",
    title: "Screen Time Limit Reached",
    description: "Daily screen time limit was reached on iPad.",
    timestamp: subMinutes(new Date(), 23),
    icon: <Clock3 className="h-5 w-5 text-amber-500" />,
    severity: "warning",
  },
  {
    id: "2",
    type: "blocked_content",
    title: "Content Blocked",
    description: "Attempted access to blocked site 'facebook.com'",
    timestamp: subHours(new Date(), 2),
    icon: <Shield className="h-5 w-5 text-red-500" />,
    severity: "error",
  },
  {
    id: "3",
    type: "new_app",
    title: "New App Installed",
    description: "TikTok was installed on iPhone 12",
    timestamp: subHours(new Date(), 5),
    icon: <AlertTriangle className="h-5 w-5 text-blue-500" />,
    severity: "info",
  },
  {
    id: "4",
    type: "bedtime",
    title: "Device Used After Bedtime",
    description: "Android Tablet was used 30 minutes after bedtime",
    timestamp: subDays(new Date(), 1),
    icon: <Clock3 className="h-5 w-5 text-amber-500" />,
    severity: "warning",
  },
];

export default function ChildDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton href="/children" />
          <h1 className="text-2xl font-bold">Child Profile</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/children/${params.id}`}>
              <Laptop className="mr-2 h-4 w-4" />
              Manage Devices
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/children/${params.id}`}>
              <Settings2 className="mr-2 h-4 w-4" />
              Advanced Settings
            </Link>
          </Button>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <ActivitySquare className="h-4 w-4 text-blue-500" />
        <AlertTitle>Real-time monitoring active</AlertTitle>
        <AlertDescription>
          You're receiving live updates for this child's device usage and
          activity.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Profile and Usage Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-2 border-b pb-2">
                <User className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </div>
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex-1">
                <ChildProfile id={params.id} />
              </div>
            </div>

            <div className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-2 border-b pb-2">
                <ActivitySquare className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">Activity & Usage</h2>
              </div>
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden flex-1">
                <UsageStats id={params.id} />
              </div>
            </div>
          </div>

          {/* Recent Alerts Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-semibold">Recent Alerts</h2>
              </div>
              <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200">
                {mockAlerts.length} new
              </Badge>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              {mockAlerts.length > 0 ? (
                <div className="divide-y">
                  {mockAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 flex items-start gap-3 hover:bg-gray-50"
                    >
                      <div className="mt-0.5">{alert.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">
                            {alert.title}
                          </p>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={`ml-2 ${
                                alert.severity === "error"
                                  ? "bg-red-50 text-red-600 border-red-200"
                                  : alert.severity === "warning"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-blue-50 text-blue-600 border-blue-200"
                              }`}
                            >
                              {alert.severity === "error"
                                ? "Critical"
                                : alert.severity === "warning"
                                ? "Warning"
                                : "Info"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {alert.description}
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {format(alert.timestamp, "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">
                    No recent alerts for this child.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    You'll be notified here when important events occur, such as
                    screen time overuse or blocked content attempts.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 p-4 border-t flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  View All Alerts
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Settings Section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-semibold">Time Restrictions</h2>
              </div>
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <TimeSettings id={params.id} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold">Content Filtering</h2>
              </div>
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <ContentRules id={params.id} />
              </div>
            </div>
          </div>

          {/* Additional settings that could be added */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Settings2 className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold">Advanced Settings</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">App-specific restrictions</h3>
                  <p className="text-sm text-muted-foreground">
                    Set limits for specific apps
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Coming Soon
                </Button>
              </div>
              <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Location tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your child's current location
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
