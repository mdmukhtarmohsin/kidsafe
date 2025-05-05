import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function ReportsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Analyze your children's device usage over time</p>
      </div>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export Data
      </Button>
    </div>
  )
}
