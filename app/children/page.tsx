import { ChildrenHeader } from "@/components/children/children-header"
import { ChildrenList } from "@/components/children/children-list"
import { AddChildButton } from "@/components/children/add-child-button"

export default function ChildrenPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ChildrenHeader />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Child Profiles</h2>
        <AddChildButton />
      </div>
      <ChildrenList />
    </div>
  )
}
