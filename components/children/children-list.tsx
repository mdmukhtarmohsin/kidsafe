import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Settings } from "lucide-react"
import Link from "next/link"

export function ChildrenList() {
  // Mock data for children
  const children = [
    {
      id: "1",
      name: "Emma",
      age: 10,
      avatar: "E",
      timeUsed: 120,
      dailyLimit: 180,
      blockedSites: 12,
      lastActive: "15 minutes ago",
    },
    {
      id: "2",
      name: "Noah",
      age: 8,
      avatar: "N",
      timeUsed: 90,
      dailyLimit: 120,
      blockedSites: 15,
      lastActive: "1 hour ago",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children.map((child) => (
        <Card key={child.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{child.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{child.name}</CardTitle>
                  <CardDescription>{child.age} years old</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/children/${child.id}`}>
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Screen Time</span>
                </div>
                <span className="text-sm font-medium">
                  {Math.floor(child.timeUsed / 60)}h {child.timeUsed % 60}m / {Math.floor(child.dailyLimit / 60)}h{" "}
                  {child.dailyLimit % 60}m
                </span>
              </div>
              <Progress value={(child.timeUsed / child.dailyLimit) * 100} />
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{child.blockedSites}</p>
                <p className="text-muted-foreground">Blocked Sites</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Active</p>
                <p className="text-muted-foreground">{child.lastActive}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/children/${child.id}`}>Manage Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
