"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/calendar-view";
import { EntryCard } from "@/components/entry-card";
import { EntryInput } from "@/components/entry-input";
import { StreakCounter } from "@/components/streak-counter";
import { formatDate } from "@/lib/utils";

interface Entry {
  id: number;
  content: string;
  date: string;
  promptText?: string | null;
}

function getTodayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const today = getTodayLocal();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [loadingEntry, setLoadingEntry] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedEntry(null);
      return;
    }

    setLoadingEntry(true);
    fetch(`/api/entries/${selectedDate}`)
      .then((res) => res.json())
      .then((entry) => {
        setSelectedEntry(entry);
      })
      .catch(() => {
        setSelectedEntry(null);
      })
      .finally(() => setLoadingEntry(false));
  }, [selectedDate]);

  const isToday = selectedDate === today;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-serif font-semibold text-foreground/90">
          Calendar
        </h1>
        <StreakCounter className="mt-3" />
      </header>

      <CalendarView
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate || undefined}
      />

      {selectedDate && (
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-sans text-muted-foreground/50 uppercase tracking-wider">
            {formatDate(selectedDate)}
          </h2>
          {loadingEntry ? (
            <p className="text-sm text-muted-foreground/40 font-sans animate-pulse">
              Loading...
            </p>
          ) : isToday ? (
            <EntryInput
              initialContent={selectedEntry?.content || ""}
              date={selectedDate}
              promptText={selectedEntry?.promptText}
            />
          ) : selectedEntry ? (
            <EntryCard
              date={selectedEntry.date}
              content={selectedEntry.content}
              promptText={selectedEntry.promptText}
            />
          ) : (
            <p className="text-sm text-muted-foreground/40 font-sans italic">
              No entry for this day.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
