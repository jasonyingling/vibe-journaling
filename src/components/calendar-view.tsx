"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

interface EntryDate {
  date: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarView({ onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [entryDates, setEntryDates] = useState<Set<string>>(new Set());

  const fetchEntries = useCallback(async () => {
    const { year, month } = currentMonth;
    const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const to = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    try {
      const res = await fetch(`/api/entries?from=${from}&to=${to}`);
      const data: EntryDate[] = await res.json();
      setEntryDates(new Set(data.map((e) => e.date)));
    } catch {
      // fail silently
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const { year, month } = currentMonth;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const prevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const days = [];
  // Empty cells for days before start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasEntry = entryDates.has(dateStr);
    const isToday = dateStr === today;
    const isSelected = dateStr === selectedDate;
    const isFuture = dateStr > today;

    days.push(
      <button
        key={dateStr}
        onClick={() => !isFuture && onDateSelect?.(dateStr)}
        disabled={isFuture}
        className={cn(
          "relative h-10 w-full rounded-md text-sm font-sans transition-colors",
          "hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring",
          isToday && "font-semibold",
          isSelected && "bg-primary/10 text-primary",
          isFuture && "opacity-30 cursor-default",
          !isFuture && !isSelected && "text-foreground/80"
        )}
      >
        {day}
        {hasEntry && (
          <span
            className={cn(
              "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
              isSelected ? "bg-primary" : "bg-primary/60"
            )}
          />
        )}
      </button>
    );
  }

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h3 className="text-sm font-medium text-foreground/80">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs text-muted-foreground/60"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}
