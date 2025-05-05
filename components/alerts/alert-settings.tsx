"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function AlertSettings() {
  // Mock data for alert settings
  const [settings, setSettings] = useState([
    { id: "time-limit", label: "Screen Time Limit Reached", enabled: true, email: true, push: true },
    { id: "blocked-site", label: "Blocked Site Attempt", enabled: true, email: false, push: true },
    { id: "unusual-activity", label: "Unusual Activity", enabled: true, email: true, push: true },
    { id: "bedtime", label: "Bedtime Mode", enabled: true, email: false, push: true },
    { id: "new-app", label: "New App Installation", enabled: false, email: false, push: false },
  ])

  const toggleSetting = (id: string, field: "enabled" | "email" | "push") => {
    setSettings(settings.map((setting) => (setting.id === id ? { ...setting, [field]: !setting[field] } : setting)))
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email for Alerts</Label>
          <Input id="email" type="email" defaultValue="parent@example.com" />
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={setting.id} className="flex-1">
                  {setting.label}
                </Label>
                <Switch
                  id={setting.id}
                  checked={setting.enabled}
                  onCheckedChange={() => toggleSetting(setting.id, "enabled")}
                />
              </div>

              {setting.enabled && (
                <div className="ml-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`${setting.id}-email`}
                      checked={setting.email}
                      onCheckedChange={() => toggleSetting(setting.id, "email")}
                    />
                    <Label htmlFor={`${setting.id}-email`}>Email</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`${setting.id}-push`}
                      checked={setting.push}
                      onCheckedChange={() => toggleSetting(setting.id, "push")}
                    />
                    <Label htmlFor={`${setting.id}-push`}>Push Notification</Label>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button className="w-full">Save Alert Settings</Button>
      </CardContent>
    </Card>
  )
}
