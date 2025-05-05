import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export function ChildHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Hello, Emma!</h1>
        <p className="text-muted-foreground">Here's your screen time for today</p>
      </div>
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Link>
      </Button>
    </div>
  )
}
