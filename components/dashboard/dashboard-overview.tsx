import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp } from "lucide-react";

export function DashboardOverview() {
  return (
    <Card className="col-span-3 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total Screen Time Today
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">5h 23m</div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <p className="text-xs text-green-500">+12% from yesterday</p>
        </div>
        <div className="mt-4 h-1 w-full bg-muted">
          <div className="h-1 w-2/3 bg-primary" />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <div>0h</div>
          <div>8h</div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Peak usage:</span> 3:00
          PM - 5:00 PM
        </div>
      </CardContent>
    </Card>
  );
}
