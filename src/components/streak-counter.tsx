"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Stats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
}

interface StreakCounterProps {
  className?: string;
  refreshKey?: number;
}

export function StreakCounter({ className, refreshKey }: StreakCounterProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => {});
  }, [refreshKey]);

  if (!stats) return null;

  return (
    <div className={cn("flex gap-6 font-sans", className)}>
      <div className="text-center">
        <div className="text-2xl font-semibold text-foreground/80">
          {stats.currentStreak}
        </div>
        <div className="text-xs text-muted-foreground">
          {stats.currentStreak === 1 ? "day" : "days"} streak
        </div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-semibold text-foreground/80">
          {stats.longestStreak}
        </div>
        <div className="text-xs text-muted-foreground">longest</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-semibold text-foreground/80">
          {stats.totalEntries}
        </div>
        <div className="text-xs text-muted-foreground">entries</div>
      </div>
    </div>
  );
}
