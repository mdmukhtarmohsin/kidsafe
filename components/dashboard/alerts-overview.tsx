import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BadgeAlertIcon as Alert, AlertCircle } from "lucide-react";
import Link from "next/link";

export function AlertsOverview() {
  // Mock data for alerts
  const alerts = [
    {
      id: "1",
      message: "Emma reached daily limit",
      time: "10 min ago",
      type: "limit",
    },
    {
      id: "2",
      message: "Noah attempted to access blocked site",
      time: "1 hour ago",
      type: "block",
    },
  ];

  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
        <Link href="/alerts" className="text-xs text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-4">
            <div className="rounded-full bg-muted p-1">
              {alert.type === "limit" ? (
                <Clock className="h-4 w-4 text-amber-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
