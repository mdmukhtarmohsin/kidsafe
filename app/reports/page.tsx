import { ReportsHeader } from "@/components/reports/reports-header";
import { UsageReports } from "@/components/reports/usage-reports";
import { ChildSelector } from "@/components/reports/child-selector";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { ReportsProvider } from "@/components/reports/reports-context";

export default function ReportsPage() {
  return (
    <ReportsProvider>
      <div className="flex flex-col gap-6 p-6">
        <ReportsHeader />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">Usage Reports</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <ChildSelector />
            <DateRangePicker />
          </div>
        </div>
        <UsageReports />
      </div>
    </ReportsProvider>
  );
}
