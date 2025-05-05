import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { ChildrenSummary } from "@/components/dashboard/children-summary";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AlertsOverview } from "@/components/dashboard/alerts-overview";

export default function DashboardPage() {
  return (
    <div className="flex flex-col  gap-6 p-4 md:p-6">
      <DashboardHeader />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardOverview />
        <ChildrenSummary />
        <AlertsOverview />
      </div>
      <RecentActivity />
    </div>
  );
}
