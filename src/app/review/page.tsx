"use client";

import { useEffect, useState } from "react";
import { EntryCard } from "@/components/entry-card";

interface Entry {
  id: number;
  content: string;
  date: string;
  promptText?: string | null;
}

export default function ReviewPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-serif font-semibold text-foreground/90">
          Review
        </h1>
        <p className="text-sm font-sans text-muted-foreground mt-1">
          {entries.length} {entries.length === 1 ? "entry" : "entries"} so far
        </p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-muted/30 animate-pulse"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm font-sans text-muted-foreground/50">
            No entries yet. Write your first thought today.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              date={entry.date}
              content={entry.content}
              promptText={entry.promptText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
