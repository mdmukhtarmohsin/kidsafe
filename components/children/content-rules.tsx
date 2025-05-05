"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Globe,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase-client";
import { Tables } from "@/lib/supabase-types";
import { toast } from "@/components/ui/use-toast";

interface ContentRulesProps {
  id: string;
}

type ContentRule = Tables<"content_rules">;

const CONTENT_CATEGORIES = [
  {
    name: "Social Media",
    key: "social_media",
    description: "Facebook, Instagram, TikTok, etc.",
  },
  {
    name: "Gaming",
    key: "gaming",
    description: "Gaming websites and services",
  },
  {
    name: "Adult Content",
    key: "adult_content",
    description: "Adult and inappropriate content",
  },
  {
    name: "Gambling",
    key: "gambling",
    description: "Gambling and betting sites",
  },
  {
    name: "Violence",
    key: "violence",
    description: "Violence, weapons, and gore",
  },
  {
    name: "Shopping",
    key: "shopping",
    description: "Online shopping platforms",
  },
  {
    name: "Streaming",
    key: "streaming",
    description: "Video streaming services",
  },
  {
    name: "Forums",
    key: "forums",
    description: "Online forums and communities",
  },
];

export function ContentRules({ id }: ContentRulesProps) {
  const [newSite, setNewSite] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [blockedSites, setBlockedSites] = useState<string[]>([]);
  const [categoryRules, setCategoryRules] = useState<Record<string, boolean>>(
    {}
  );
  const [rules, setRules] = useState<ContentRule[]>([]);

  // Fetch content rules
  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("content_rules")
          .select("*")
          .eq("child_id", id);

        if (error) throw error;

        setRules(data || []);

        // Parse rules into our UI state
        const sites: string[] = [];
        const categories: Record<string, boolean> = {};

        // Initialize all categories to false (not blocked)
        CONTENT_CATEGORIES.forEach((cat) => {
          categories[cat.key] = false;
        });

        // Set values based on rules
        data?.forEach((rule) => {
          if (rule.rule_type === "url" && rule.url) {
            sites.push(rule.url);
          } else if (rule.rule_type === "category" && rule.category) {
            categories[rule.category] = rule.is_blocked;
          }
        });

        setBlockedSites(sites);
        setCategoryRules(categories);
      } catch (error) {
        console.error("Error fetching content rules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, [id]);

  const addSite = async () => {
    if (!newSite || blockedSites.includes(newSite)) return;

    setIsSaving(true);
    try {
      // Add to database
      const { error } = await supabase.from("content_rules").insert({
        child_id: id,
        url: newSite,
        is_blocked: true,
        rule_type: "url",
      });

      if (error) throw error;

      // Update local state
      setBlockedSites([...blockedSites, newSite]);
      setNewSite("");

      toast({
        title: "Website blocked",
        description: `${newSite} has been added to the blocked list.`,
      });
    } catch (error) {
      console.error("Error adding blocked site:", error);
      toast({
        title: "Failed to block website",
        description: "There was an error adding the site to the blocked list.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeSite = async (site: string) => {
    setIsSaving(true);
    try {
      // Remove from database
      const { error } = await supabase
        .from("content_rules")
        .delete()
        .eq("child_id", id)
        .eq("url", site)
        .eq("rule_type", "url");

      if (error) throw error;

      // Update local state
      setBlockedSites(blockedSites.filter((s) => s !== site));

      toast({
        title: "Website unblocked",
        description: `${site} has been removed from the blocked list.`,
      });
    } catch (error) {
      console.error("Error removing blocked site:", error);
      toast({
        title: "Failed to unblock website",
        description:
          "There was an error removing the site from the blocked list.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = async (key: string) => {
    const newValue = !categoryRules[key];

    setIsSaving(true);
    try {
      // Check if rule exists
      const existingRule = rules.find(
        (rule) => rule.rule_type === "category" && rule.category === key
      );

      if (existingRule) {
        // Update existing rule
        const { error } = await supabase
          .from("content_rules")
          .update({ is_blocked: newValue })
          .eq("id", existingRule.id);

        if (error) throw error;
      } else {
        // Create new rule
        const { error } = await supabase.from("content_rules").insert({
          child_id: id,
          category: key,
          is_blocked: newValue,
          rule_type: "category",
        });

        if (error) throw error;
      }

      // Update local state
      setCategoryRules({
        ...categoryRules,
        [key]: newValue,
      });

      toast({
        title: `${CONTENT_CATEGORIES.find((c) => c.key === key)?.name} ${
          newValue ? "blocked" : "allowed"
        }`,
        description: `Content in this category is now ${
          newValue ? "blocked" : "allowed"
        }.`,
      });
    } catch (error) {
      console.error("Error toggling category:", error);
      toast({
        title: "Failed to update category",
        description: "There was an error updating the category setting.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle>Content Rules</CardTitle>
          <Badge
            variant="outline"
            className="ml-2 text-amber-500 border-amber-200 bg-amber-50"
          >
            <ShieldAlert className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
        <CardDescription>
          Manage website and content restrictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sites">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sites">Blocked Sites</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          <TabsContent value="sites" className="space-y-4 pt-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Globe className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter website URL"
                  value={newSite}
                  onChange={(e) => setNewSite(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                onClick={addSite}
                type="button"
                disabled={isSaving || !newSite}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Add
              </Button>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
              {blockedSites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center border rounded-md bg-muted/10">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">
                    No blocked sites added yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add websites you want to restrict access to.
                  </p>
                </div>
              ) : (
                blockedSites.map((site) => (
                  <div
                    key={site}
                    className="flex items-center justify-between rounded-md border p-2.5 bg-background"
                  >
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className="bg-red-50 border-red-200 text-red-500 h-5 w-5 p-0 flex items-center justify-center mr-2"
                      >
                        <X className="h-3 w-3" />
                      </Badge>
                      <span className="text-sm font-medium">{site}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSite(site)}
                      disabled={isSaving}
                      className="h-8 w-8 p-0"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="categories" className="space-y-4 pt-4">
            <div className="space-y-4">
              {CONTENT_CATEGORIES.map((category) => (
                <div
                  key={category.key}
                  className="flex items-center justify-between p-3 rounded-md border bg-background"
                >
                  <div>
                    <Label
                      htmlFor={`category-${category.key}`}
                      className="font-medium"
                    >
                      {category.name}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      className={`mr-3 ${
                        categoryRules[category.key]
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "bg-green-50 border-green-200 text-green-500"
                      }`}
                    >
                      {categoryRules[category.key] ? (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Blocked
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Allowed
                        </>
                      )}
                    </Badge>
                    <Switch
                      id={`category-${category.key}`}
                      checked={categoryRules[category.key]}
                      onCheckedChange={() => toggleCategory(category.key)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
