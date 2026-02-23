import { NextResponse } from "next/server";
import { db } from "@/db";
import { prompts, pillars } from "@/db/schema";
import { sql, count } from "drizzle-orm";

export async function GET() {
  // Get all prompts
  const allPrompts = db.select().from(prompts).all();

  if (allPrompts.length === 0) {
    return NextResponse.json({
      text: "What's on your mind?",
      id: null,
    });
  }

  // Get user's pillar IDs to weight prompts toward their pillars
  const userPillars = db.select().from(pillars).all();
  const pillarIds = new Set(userPillars.map((p) => p.id));

  // Use date as seed for deterministic daily rotation
  const today = new Date().toISOString().split("T")[0];
  const dateSeed = today.split("-").join("");
  const seedNum = parseInt(dateSeed, 10);

  // Separate pillar-associated and general prompts
  const pillarPrompts = allPrompts.filter(
    (p) => p.pillarId && pillarIds.has(p.pillarId)
  );
  const generalPrompts = allPrompts.filter((p) => !p.pillarId);

  // 60% chance to pick pillar-associated if available, 40% general
  let pool =
    pillarPrompts.length > 0 && seedNum % 10 < 6
      ? pillarPrompts
      : generalPrompts;

  if (pool.length === 0) pool = allPrompts;

  const index = seedNum % pool.length;
  const selected = pool[index];

  return NextResponse.json({
    id: selected.id,
    text: selected.text,
  });
}
