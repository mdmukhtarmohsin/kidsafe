import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ChildProfileProps {
  id: string
}

export function ChildProfile({ id }: ChildProfileProps) {
  // Mock data for child profile
  const child = {
    id,
    name: "Emma",
    age: 10,
    avatar: "E",
    deviceId: "tablet-123",
    createdAt: "January 15, 2023",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your child's profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">{child.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold">{child.name}</h3>
            <p className="text-muted-foreground">{child.age} years old</p>
            <p className="text-xs text-muted-foreground">Added on {child.createdAt}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={child.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" defaultValue={child.age} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="device">Device ID</Label>
            <Input id="device" defaultValue={child.deviceId} />
          </div>
          <Button className="w-full">Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}
