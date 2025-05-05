import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-notifications" className="flex-1">
              Email Notifications
            </Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="push-notifications" className="flex-1">
              Push Notifications
            </Label>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="daily-summary" className="flex-1">
              Daily Summary Email
            </Label>
            <Switch id="daily-summary" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="weekly-report" className="flex-1">
              Weekly Report Email
            </Label>
            <Switch id="weekly-report" defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="critical-alerts" className="flex-1">
              Critical Alerts Only
            </Label>
            <Switch id="critical-alerts" />
          </div>
          <Button>Save Notification Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}
