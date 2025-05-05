"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"
import { useState } from "react"

export function AddChildButton() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Child
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new child</DialogTitle>
          <DialogDescription>Create a new profile for your child to monitor their device usage.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter child's name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" placeholder="Enter child's age" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="device">Device ID</Label>
            <Input id="device" placeholder="Enter device ID" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="limit">Daily Time Limit (minutes)</Label>
            <Input id="limit" type="number" placeholder="Enter daily time limit" defaultValue={120} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Add Child</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
