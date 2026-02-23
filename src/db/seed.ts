import { db } from "./index";
import { prompts, pillars } from "./schema";
import { count, eq } from "drizzle-orm";
import { seedPrompts } from "./seed-data";

function seed() {
  // Check if prompts already seeded
  const existing = db.select({ total: count() }).from(prompts).get();
  if (existing && existing.total > 0) {
    console.log(`Prompts already seeded (${existing.total} found). Skipping.`);
    return;
  }

  // Build a map from pillar name to ID for category matching
  const allPillars = db.select().from(pillars).all();
  const pillarNameToId = new Map<string, number>();
  for (const p of allPillars) {
    pillarNameToId.set(p.name, p.id);
  }

  console.log("Seeding prompts...");

  for (const prompt of seedPrompts) {
    const pillarId = prompt.category
      ? pillarNameToId.get(prompt.category) ?? null
      : null;
    db.insert(prompts)
      .values({ text: prompt.text, pillarId })
      .run();
  }

  console.log(`Seeded ${seedPrompts.length} prompts.`);
}

seed();
