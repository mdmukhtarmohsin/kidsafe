import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Monitor your children's device usage</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/alerts">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Alerts</span>
          </Link>
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}
