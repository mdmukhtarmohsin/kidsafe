"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface TimeSettingsProps {
  id: string
}

export function TimeSettings({ id }: TimeSettingsProps) {
  const [dailyLimit, setDailyLimit] = useState(180)
  const [enableBedtime, setEnableBedtime] = useState(true)
  const [bedtime, setBedtime] = useState("21:00")
  const [wakeTime, setWakeTime] = useState("07:00")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Limits</CardTitle>
        <CardDescription>Set daily screen time limits and schedules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-limit">Daily Screen Time Limit</Label>
              <span className="text-sm font-medium">
                {Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m
              </span>
            </div>
            <Slider
              id="daily-limit"
              min={30}
              max={480}
              step={15}
              value={[dailyLimit]}
              onValueChange={(value) => setDailyLimit(value[0])}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enable-bedtime" className="flex-1">
              Enable Bedtime Mode
            </Label>
            <Switch id="enable-bedtime" checked={enableBedtime} onCheckedChange={setEnableBedtime} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedtime">Bedtime</Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                disabled={!enableBedtime}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wake-time">Wake Time</Label>
              <Input
                id="wake-time"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                disabled={!enableBedtime}
              />
            </div>
          </div>
          <Button className="w-full">Save Time Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}
