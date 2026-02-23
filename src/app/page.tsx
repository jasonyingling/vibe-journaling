"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EntryInput } from "@/components/entry-input";
import { EntryCard } from "@/components/entry-card";
import { PromptDisplay } from "@/components/prompt-display";
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

function getYesterdayLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function HomePage() {
  const router = useRouter();
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const [yesterdayEntry, setYesterdayEntry] = useState<Entry | null>(null);
  const [promptText, setPromptText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const today = getTodayLocal();
  const yesterday = getYesterdayLocal();

  useEffect(() => {
    // Check onboarding
    fetch("/api/pillars")
      .then((res) => res.json())
      .then((pillars) => {
        if (!pillars || pillars.length === 0) {
          router.push("/onboarding");
        }
      })
      .catch(() => {});

    // Fetch today's entry
    fetch(`/api/entries/${today}`)
      .then((res) => res.json())
      .then((entry) => {
        if (entry) setTodayEntry(entry);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch yesterday's entry
    fetch(`/api/entries/${yesterday}`)
      .then((res) => res.json())
      .then((entry) => {
        if (entry) setYesterdayEntry(entry);
      })
      .catch(() => {});
  }, [today, yesterday, router]);

  const handlePromptLoaded = useCallback((text: string) => {
    setPromptText(text);
  }, []);

  const handleSave = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground/40 text-sm font-sans animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-serif font-semibold text-foreground/90">
          {formatDate(today)}
        </h1>
        <StreakCounter
          className="mt-3"
          refreshKey={refreshKey}
        />
      </header>

      <section className="space-y-2">
        <PromptDisplay onPromptLoaded={handlePromptLoaded} />
        <EntryInput
          initialContent={todayEntry?.content || ""}
          date={today}
          promptText={promptText}
          onSave={handleSave}
        />
      </section>

      {yesterdayEntry && (
        <section className="space-y-2 pt-4">
          <h2 className="text-xs font-sans text-muted-foreground/50 uppercase tracking-wider">
            Yesterday
          </h2>
          <EntryCard
            date={yesterdayEntry.date}
            content={yesterdayEntry.content}
            promptText={yesterdayEntry.promptText}
            compact
          />
        </section>
      )}
    </div>
  );
}
