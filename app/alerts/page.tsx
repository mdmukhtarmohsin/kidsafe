import { AlertsHeader } from "@/components/alerts/alerts-header";
import { AlertsList } from "@/components/alerts/alerts-list";
import { AlertSettings } from "@/components/alerts/alert-settings";
import { AlertsProvider } from "@/components/alerts/alerts-context";

export default function AlertsPage() {
  return (
    <AlertsProvider>
      <div className="flex flex-col gap-6 p-6">
        <AlertsHeader />
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4">Alert Settings</h2>
            <AlertSettings />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Alerts</h2>
            <AlertsList />
          </div>
        </div>
      </div>
    </AlertsProvider>
  );
}
