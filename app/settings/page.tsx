import { SettingsHeader } from "@/components/settings/settings-header";
import { AccountSettings } from "@/components/settings/account-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { AppSettings } from "@/components/settings/app-settings";
import { SettingsProvider } from "@/components/settings/settings-context";

export default function SettingsPage() {
  return (
    <SettingsProvider>
      <div className="flex flex-col gap-6 p-6">
        <SettingsHeader />
        <div className="grid gap-6 md:grid-cols-2">
          <AccountSettings />
          <NotificationSettings />
        </div>
        <AppSettings />
      </div>
    </SettingsProvider>
  );
}
