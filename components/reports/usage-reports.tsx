"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useReports } from "./reports-context";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function UsageReports() {
  const { usageData, isLoading, error, selectedChildId, startDate, endDate } =
    useReports();
  const { hourlyData, appUsageData, weeklyData, monthlyData } = usageData;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading report data</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const dateRangeText = `${format(startDate, "MMM d, yyyy")} - ${format(
    endDate,
    "MMM d, yyyy"
  )}`;

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground mb-2">
        Showing data for{" "}
        {selectedChildId === "all" ? "all children" : "selected child"} from{" "}
        {dateRangeText}
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Usage</CardTitle>
                <CardDescription>
                  Screen time by hour of the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyData}>
                      <defs>
                        <linearGradient
                          id="colorUsage"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip
                        formatter={(value) => [`${value} minutes`, "Usage"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="usage"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUsage)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>App Distribution</CardTitle>
                <CardDescription>Time spent on different apps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {appUsageData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value} minutes`, "Usage"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Screen Time</CardTitle>
              <CardDescription>Screen time by day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} minutes`, "Usage"]}
                    />
                    <Legend />
                    {Object.keys(weeklyData[0])
                      .filter((key) => key !== "name")
                      .map((childName, index) => (
                        <Bar
                          key={childName}
                          dataKey={childName}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>
                Screen time trends over the past month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} minutes`, "Usage"]}
                    />
                    <Legend />
                    {Object.keys(monthlyData[0])
                      .filter((key) => key !== "name")
                      .map((childName, index) => (
                        <Line
                          key={childName}
                          type="monotone"
                          dataKey={childName}
                          stroke={COLORS[index % COLORS.length]}
                          activeDot={{ r: 8 }}
                        />
                      ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
