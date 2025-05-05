"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useReports } from "./reports-context";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export function ReportsHeader() {
  const { selectedChildId, startDate, endDate, usageData, children } =
    useReports();
  const { toast } = useToast();

  const handleExportData = () => {
    try {
      // Format the filename based on selection
      const childName =
        selectedChildId === "all"
          ? "all-children"
          : children
              .find((c) => c.id === selectedChildId)
              ?.name.toLowerCase() || "unknown";

      const dateRange = `${format(startDate, "yyyy-MM-dd")}_to_${format(
        endDate,
        "yyyy-MM-dd"
      )}`;
      const filename = `kidshield_report_${childName}_${dateRange}.json`;

      // Create a data structure to export
      const dataToExport = {
        metadata: {
          generated: new Date().toISOString(),
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          child:
            selectedChildId === "all"
              ? "All Children"
              : children.find((c) => c.id === selectedChildId)?.name,
        },
        data: usageData,
      };

      // Convert to JSON and create downloadable file
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create download link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Report downloaded",
        description: `Data exported to ${filename}`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "There was a problem exporting the report data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Analyze your children's device usage over time
        </p>
      </div>
      <Button variant="outline" onClick={handleExportData}>
        <Download className="mr-2 h-4 w-4" />
        Export Data
      </Button>
    </div>
  );
}
