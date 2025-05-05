"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, subDays } from "date-fns";
import { useReports } from "./reports-context";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";
import React from "react";
import { cn } from "@/lib/utils";

export function DateRangePicker() {
  const { startDate, endDate, setDateRange, isLoading } = useReports();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  });

  // Update context when date range changes
  React.useEffect(() => {
    if (date?.from && date?.to) {
      setDateRange(date.from, date.to);
    }
  }, [date, setDateRange]);

  // Predefined ranges
  const handleLastWeek = () => {
    const today = new Date();
    const from = subDays(today, 7);
    const to = today;
    setDate({ from, to });
    setDateRange(from, to);
  };

  const handleLastMonth = () => {
    const today = new Date();
    const from = subDays(today, 30);
    const to = today;
    setDate({ from, to });
    setDateRange(from, to);
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-[240px]" />;
  }

  return (
    <div className="flex flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[240px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL d, y")} -{" "}
                  {format(date.to, "LLL d, y")}
                </>
              ) : (
                format(date.from, "LLL d, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastWeek}
              className="text-xs"
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastMonth}
              className="text-xs"
            >
              Last 30 days
            </Button>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            className={cn("p-3")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
