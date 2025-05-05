"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReports } from "./reports-context";
import { Skeleton } from "@/components/ui/skeleton";

export function ChildSelector() {
  const { children, selectedChildId, setSelectedChildId, isLoading } =
    useReports();

  if (isLoading) {
    return <Skeleton className="h-10 w-[180px]" />;
  }

  return (
    <Select value={selectedChildId} onValueChange={setSelectedChildId}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select child" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Children</SelectItem>
        {children.map((child) => (
          <SelectItem key={child.id} value={child.id}>
            {child.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
