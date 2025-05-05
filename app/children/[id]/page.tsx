import { ChildProfile } from "@/components/children/child-profile"
import { UsageStats } from "@/components/children/usage-stats"
import { TimeSettings } from "@/components/children/time-settings"
import { ContentRules } from "@/components/children/content-rules"
import { BackButton } from "@/components/ui/back-button"

export default function ChildDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <BackButton href="/children" />
        <h1 className="text-2xl font-bold">Child Profile</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <ChildProfile id={params.id} />
        <UsageStats id={params.id} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <TimeSettings id={params.id} />
        <ContentRules id={params.id} />
      </div>
    </div>
  )
}
