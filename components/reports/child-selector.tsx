"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ChildSelector() {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select child" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Children</SelectItem>
        <SelectItem value="1">Emma</SelectItem>
        <SelectItem value="2">Noah</SelectItem>
      </SelectContent>
    </Select>
  )
}
