import { Button } from "@/components/ui/button"
import { BellOff } from "lucide-react"

export function AlertsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Alerts</h1>
        <p className="text-muted-foreground">Configure and view alerts for your children's device usage</p>
      </div>
      <Button variant="outline">
        <BellOff className="mr-2 h-4 w-4" />
        Mute All Alerts
      </Button>
    </div>
  )
}
