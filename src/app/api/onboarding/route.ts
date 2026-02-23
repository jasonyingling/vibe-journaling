import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { pillars, settings, prompts } from "@/db/schema";
import { eq, count } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pillars: pillarList } = body;

  if (!Array.isArray(pillarList) || pillarList.length === 0) {
    return NextResponse.json(
      { error: "At least one pillar is required" },
      { status: 400 }
    );
  }

  // Insert pillars
  for (let i = 0; i < pillarList.length; i++) {
    const p = pillarList[i];
    db.insert(pillars)
      .values({
        name: p.name,
        description: p.description || null,
        sortOrder: i,
      })
      .run();
  }

  // Seed prompts if not already seeded
  const promptCount = db.select({ total: count() }).from(prompts).get();
  if (!promptCount || promptCount.total === 0) {
    const { seedPrompts } = await import("@/db/seed-data");
    for (const prompt of seedPrompts) {
      db.insert(prompts)
        .values({ text: prompt.text, pillarId: prompt.pillarId })
        .run();
    }
  }

  // Mark onboarding complete
  db.insert(settings)
    .values({ key: "onboarding_complete", value: "true" })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: "true" },
    })
    .run();

  return NextResponse.json({ success: true }, { status: 201 });
}
