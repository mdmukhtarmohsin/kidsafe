import { ChildHeader } from "@/components/child/child-header"
import { TimeRemaining } from "@/components/child/time-remaining"
import { UsageSummary } from "@/components/child/usage-summary"
import { BlockedAttempts } from "@/components/child/blocked-attempts"

export default function ChildDashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ChildHeader />
      <div className="grid gap-6 md:grid-cols-2">
        <TimeRemaining />
        <UsageSummary />
      </div>
      <BlockedAttempts />
    </div>
  )
}
