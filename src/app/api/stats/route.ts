import { NextResponse } from "next/server";
import { db } from "@/db";
import { entries } from "@/db/schema";
import { desc, count } from "drizzle-orm";

export async function GET() {
  // Get total entry count
  const totalResult = db.select({ total: count() }).from(entries).get();
  const totalEntries = totalResult?.total ?? 0;

  // Get all entry dates sorted descending for streak calculation
  const allDates = db
    .select({ date: entries.date })
    .from(entries)
    .orderBy(desc(entries.date))
    .all()
    .map((e) => e.date);

  if (allDates.length === 0) {
    return NextResponse.json({
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
    });
  }

  // Calculate current streak
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const dateSet = new Set(allDates);

  let currentStreak = 0;
  const checkDate = new Date(today);

  // Check if today or yesterday has an entry to start the streak
  const todayStr = checkDate.toISOString().split("T")[0];
  checkDate.setDate(checkDate.getDate() - 1);
  const yesterdayStr = checkDate.toISOString().split("T")[0];

  if (dateSet.has(todayStr)) {
    // Start counting from today
    checkDate.setTime(today.getTime());
  } else if (dateSet.has(yesterdayStr)) {
    // Start counting from yesterday (today isn't over yet)
    checkDate.setDate(today.getDate() - 1);
  } else {
    // No current streak
    currentStreak = 0;
  }

  if (dateSet.has(todayStr) || dateSet.has(yesterdayStr)) {
    const startDate = new Date(checkDate);
    startDate.setHours(12, 0, 0, 0);
    while (dateSet.has(startDate.toISOString().split("T")[0])) {
      currentStreak++;
      startDate.setDate(startDate.getDate() - 1);
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let streak = 1;

  const sortedDates = [...allDates].sort();
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1] + "T12:00:00");
    const curr = new Date(sortedDates[i] + "T12:00:00");
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      streak++;
    } else {
      longestStreak = Math.max(longestStreak, streak);
      streak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, streak);

  return NextResponse.json({
    totalEntries,
    currentStreak,
    longestStreak,
  });
}
