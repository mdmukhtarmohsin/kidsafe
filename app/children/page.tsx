import { ChildrenHeader } from "@/components/children/children-header";
import { ChildrenList } from "@/components/children/children-list";
import { AddChildButton } from "@/components/children/add-child-button";
import { GenerateDataButton } from "@/components/children/generate-data-button";
import { Suspense } from "react";

export default function ChildrenPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ChildrenHeader />
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Child Profiles</h2>
        <div className="flex gap-2">
          <GenerateDataButton />
          <AddChildButton />
        </div>
      </div>
      <Suspense
        fallback={
          <div className="text-center p-4">Loading children profiles...</div>
        }
      >
        <ChildrenList />
      </Suspense>
    </div>
  );
}
