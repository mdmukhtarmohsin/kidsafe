"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"

interface ContentRulesProps {
  id: string
}

export function ContentRules({ id }: ContentRulesProps) {
  const [newSite, setNewSite] = useState("")

  // Mock data for blocked sites and categories
  const [blockedSites, setBlockedSites] = useState(["facebook.com", "instagram.com", "tiktok.com"])

  const [categories, setCategories] = useState([
    { name: "Social Media", enabled: true },
    { name: "Gaming", enabled: false },
    { name: "Adult Content", enabled: true },
    { name: "Gambling", enabled: true },
    { name: "Violence", enabled: true },
  ])

  const addSite = () => {
    if (newSite && !blockedSites.includes(newSite)) {
      setBlockedSites([...blockedSites, newSite])
      setNewSite("")
    }
  }

  const removeSite = (site: string) => {
    setBlockedSites(blockedSites.filter((s) => s !== site))
  }

  const toggleCategory = (index: number) => {
    const newCategories = [...categories]
    newCategories[index].enabled = !newCategories[index].enabled
    setCategories(newCategories)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Rules</CardTitle>
        <CardDescription>Manage website and content restrictions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sites">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sites">Blocked Sites</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="sites" className="space-y-4 pt-4">
            <div className="flex space-x-2">
              <Input placeholder="Enter website URL" value={newSite} onChange={(e) => setNewSite(e.target.value)} />
              <Button onClick={addSite} type="button">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {blockedSites.map((site) => (
                <div key={site} className="flex items-center justify-between rounded-md border p-2">
                  <span className="text-sm">{site}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeSite(site)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              {blockedSites.length === 0 && (
                <p className="text-sm text-muted-foreground">No blocked sites added yet.</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="categories" className="space-y-4 pt-4">
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <Label htmlFor={`category-${index}`} className="flex-1">
                    {category.name}
                  </Label>
                  <Switch
                    id={`category-${index}`}
                    checked={category.enabled}
                    onCheckedChange={() => toggleCategory(index)}
                  />
                </div>
              ))}
            </div>
            <Button className="w-full">Save Category Settings</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
