"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import type { Tables, TablesInsert } from "@/lib/supabase-types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert as UiAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CalendarDays,
  Edit2,
  Phone,
  School,
  Terminal,
  User,
  PlusCircle,
  Smartphone,
  Tablet,
  Laptop,
  Trash2,
  Copy,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { v4 as uuidv4 } from "uuid";

interface ChildProfileProps {
  id: string;
}

type Child = Tables<"children">;
type Device = Tables<"devices">;

// Device schema for form validation
const deviceSchema = z.object({
  device_name: z.string().min(1, { message: "Device name is required." }),
  device_type: z.enum(["phone", "tablet", "computer"], {
    required_error: "Device type is required.",
  }),
  os_type: z.enum(["android", "ios", "windows", "macos"], {
    required_error: "Operating system is required.",
  }),
});

export function ChildProfile({ id }: ChildProfileProps) {
  const [child, setChild] = useState<Child | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [isSubmittingDevice, setIsSubmittingDevice] = useState(false);
  const { toast } = useToast();

  // Device form
  const deviceForm = useForm<z.infer<typeof deviceSchema>>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      device_name: "",
      device_type: "phone",
      os_type: "android",
    },
  });

  // Fetch child data
  useEffect(() => {
    const fetchChildData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch child profile
        const { data: childData, error: childError } = await supabase
          .from("children")
          .select("*")
          .eq("id", id)
          .single();

        if (childError) throw childError;
        if (!childData) throw new Error("Child not found.");

        setChild(childData);

        // Fetch child's devices
        const { data: deviceData, error: deviceError } = await supabase
          .from("devices")
          .select("*")
          .eq("child_id", id);

        if (deviceError) throw deviceError;
        setDevices(deviceData || []);
      } catch (err: any) {
        console.error("Error fetching child profile:", err);
        setError(err.message || "Failed to load profile.");
        setChild(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchChildData();
    }
  }, [id]);

  // Reset device form when dialog closes
  useEffect(() => {
    if (!isAddingDevice) {
      deviceForm.reset();
      setIsSubmittingDevice(false);
    }
  }, [isAddingDevice, deviceForm]);

  // Add device handler
  const handleAddDevice = async (values: z.infer<typeof deviceSchema>) => {
    if (!child) return;

    setIsSubmittingDevice(true);
    try {
      // Generate a unique device ID - this will be used for child login
      const deviceId = `${values.device_type}-${uuidv4().substring(0, 8)}`;

      const deviceData: TablesInsert<"devices"> = {
        child_id: id,
        device_id: deviceId,
        device_name: values.device_name,
        device_type: values.device_type,
        os_type: values.os_type,
        is_active: false,
      };

      const { data, error: insertError } = await supabase
        .from("devices")
        .insert(deviceData)
        .select()
        .single();

      if (insertError) throw insertError;

      // Update local state
      setDevices([...devices, data]);
      setIsAddingDevice(false);

      toast({
        title: "Device Added",
        description: `${values.device_name} has been added successfully. Device ID: ${deviceId}`,
      });
    } catch (err: any) {
      console.error("Error adding device:", err);
      toast({
        title: "Failed to Add Device",
        description:
          err.message || "An error occurred while adding the device.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingDevice(false);
    }
  };

  // Copy device ID to clipboard
  const copyDeviceId = (deviceId: string) => {
    navigator.clipboard.writeText(deviceId);
    toast({
      title: "Copied",
      description: "Device ID copied to clipboard",
    });
  };

  // Delete device
  const deleteDevice = async (deviceId: string) => {
    try {
      const { error } = await supabase
        .from("devices")
        .delete()
        .eq("id", deviceId);

      if (error) throw error;

      // Update local state
      setDevices(devices.filter((device) => device.id !== deviceId));

      toast({
        title: "Device Removed",
        description: "The device has been removed successfully.",
      });
    } catch (err: any) {
      console.error("Error removing device:", err);
      toast({
        title: "Failed to Remove Device",
        description:
          err.message || "An error occurred while removing the device.",
        variant: "destructive",
      });
    }
  };

  // Get device icon based on type
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "phone":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "computer":
        return <Laptop className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  // Render Loading State
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render Error State
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <UiAlert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Failed to Load Profile</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </UiAlert>
        </CardContent>
      </Card>
    );
  }

  // Render Profile Data
  if (!child) {
    return (
      <Card>
        <CardContent>Child data not available.</CardContent>
      </Card>
    );
  }

  // Get current status with color
  const getStatusBadge = () => {
    const status = child.status || "offline";
    const colorMap: Record<string, string> = {
      online: "bg-green-500",
      offline: "bg-gray-400",
      restricted: "bg-amber-500",
      blocked: "bg-red-500",
    };

    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colorMap[status]}`}></div>
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Profile Information</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
        <CardDescription>
          View and manage your child's profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="h-24 w-24 border-2 border-blue-100">
            {child.avatar_url ? (
              <AvatarImage src={child.avatar_url} alt={child.name} />
            ) : (
              <AvatarFallback className="text-3xl bg-blue-50 text-blue-500">
                {child.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <h3 className="text-2xl font-bold">{child.name}</h3>
              <Badge variant="outline" className="ml-0 sm:ml-2 self-center">
                {getStatusBadge()}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {child.age ? `${child.age} years old` : "Age not set"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <User className="h-3 w-3" />
              Added on {format(new Date(child.created_at), "PPP")}
            </p>
            {child.last_active && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Last active: {format(new Date(child.last_active), "Pp")}
              </p>
            )}
          </div>
        </div>

        <Separator />

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name-edit">Name</Label>
              <Input
                id="name-edit"
                defaultValue={child.name}
                placeholder="Child's name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age-edit">Age</Label>
              <Input
                id="age-edit"
                type="number"
                defaultValue={child.age || ""}
                placeholder="Age"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pin-edit">PIN</Label>
              <Input
                id="pin-edit"
                type="password"
                defaultValue={child.pin || ""}
                placeholder="Device unlock PIN"
              />
              <p className="text-xs text-muted-foreground">
                PIN is used by your child to unlock restricted devices.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-medium">{child.name}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Age</Label>
                <p className="font-medium">{child.age || "Not set"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">PIN</Label>
                <p className="font-medium">{child.pin ? "••••" : "Not set"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Time Used Today
                </Label>
                <p className="font-medium">
                  {Math.floor(child.time_used / 60)}h {child.time_used % 60}m
                </p>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Devices Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-blue-500" />
              Devices ({devices.length})
            </h4>

            {/* Add Device Dialog */}
            <Dialog open={isAddingDevice} onOpenChange={setIsAddingDevice}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Add Device
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Device</DialogTitle>
                  <DialogDescription>
                    Add a device for {child.name} to use with their account.
                    They will use the Device ID and PIN to log in.
                  </DialogDescription>
                </DialogHeader>

                <Form {...deviceForm}>
                  <form
                    onSubmit={deviceForm.handleSubmit(handleAddDevice)}
                    className="space-y-4 py-4"
                  >
                    <FormField
                      control={deviceForm.control}
                      name="device_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Emma's iPad" {...field} />
                          </FormControl>
                          <FormDescription>
                            A name to identify this device
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={deviceForm.control}
                      name="device_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select device type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="tablet">Tablet</SelectItem>
                              <SelectItem value="computer">Computer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={deviceForm.control}
                      name="os_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operating System</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select OS" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="android">Android</SelectItem>
                              <SelectItem value="ios">iOS</SelectItem>
                              <SelectItem value="windows">Windows</SelectItem>
                              <SelectItem value="macos">macOS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingDevice(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmittingDevice}>
                        {isSubmittingDevice ? "Adding..." : "Add Device"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {devices.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-gray-50 shadow-sm">
              <div className="bg-blue-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-sm font-medium mb-2">No Devices Added</h3>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs mx-auto">
                Add a device for {child.name} to use for logging in and tracking
                activity. Each device needs a unique ID to connect.
              </p>
              <Button
                size="sm"
                variant="default"
                onClick={() => setIsAddingDevice(true)}
                className="gap-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                Add First Device
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-1">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-50 rounded-full p-1.5">
                        {getDeviceIcon(device.device_type)}
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1.5">
                          {device.device_name}
                          <div
                            className={`w-2 h-2 rounded-full ${
                              device.is_active ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {device.is_active ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs capitalize">
                      {device.os_type}
                    </Badge>
                  </div>

                  <div className="p-3">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-muted-foreground">
                            Device ID:
                          </div>
                          <div className="flex items-center">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {device.device_id}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={() => copyDeviceId(device.device_id)}
                              title="Copy device ID"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => deleteDevice(device.id)}
                          title="Remove device"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {device.last_active
                          ? `Last used: ${format(
                              new Date(device.last_active),
                              "PPp"
                            )}`
                          : "Never used"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
