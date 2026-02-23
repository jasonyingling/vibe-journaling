import { db } from "./index";
import { prompts, settings } from "./schema";
import { eq, count } from "drizzle-orm";

const seedPrompts = [
  // General prompts (no pillar association)
  { text: "What's one thing on your mind right now?", pillarId: null },
  { text: "What would make today a good day?", pillarId: null },
  { text: "What's something you noticed recently?", pillarId: null },
  { text: "What are you looking forward to?", pillarId: null },
  { text: "What's one thing you'd tell yourself a year from now?", pillarId: null },
  { text: "What's taking up most of your mental energy today?", pillarId: null },
  { text: "What's something small that made you smile?", pillarId: null },
  { text: "What would you like to remember about today?", pillarId: null },
  { text: "If today had a theme, what would it be?", pillarId: null },
  { text: "What's one thing you're proud of right now?", pillarId: null },

  // Health & Fitness
  { text: "How does your body feel today?", pillarId: null, category: "Health & Fitness" },
  { text: "What's one thing you did for yourself today?", pillarId: null, category: "Health & Fitness" },
  { text: "How did you move your body today?", pillarId: null, category: "Health & Fitness" },
  { text: "What's one healthy choice you made today?", pillarId: null, category: "Health & Fitness" },
  { text: "How's your energy level right now?", pillarId: null, category: "Health & Fitness" },

  // Career Growth
  { text: "What's one thing you moved forward today?", pillarId: null, category: "Career Growth" },
  { text: "What problem are you trying to solve right now?", pillarId: null, category: "Career Growth" },
  { text: "What's a skill you're building?", pillarId: null, category: "Career Growth" },
  { text: "What's the most interesting part of your work right now?", pillarId: null, category: "Career Growth" },
  { text: "What would you do differently at work tomorrow?", pillarId: null, category: "Career Growth" },

  // Relationships
  { text: "Who made an impact on you recently?", pillarId: null, category: "Relationships" },
  { text: "What's one thing you're grateful for about someone in your life?", pillarId: null, category: "Relationships" },
  { text: "Who have you been thinking about lately?", pillarId: null, category: "Relationships" },
  { text: "What's a conversation you'd like to have?", pillarId: null, category: "Relationships" },
  { text: "How did you connect with someone today?", pillarId: null, category: "Relationships" },

  // Creative Projects
  { text: "What's inspiring you right now?", pillarId: null, category: "Creative Projects" },
  { text: "What would you create if you had no constraints?", pillarId: null, category: "Creative Projects" },
  { text: "What's a creative idea you've been sitting on?", pillarId: null, category: "Creative Projects" },
  { text: "What did you make or build recently?", pillarId: null, category: "Creative Projects" },

  // Financial Goals
  { text: "What's one financial decision you're weighing?", pillarId: null, category: "Financial Goals" },
  { text: "What does financial peace of mind look like for you?", pillarId: null, category: "Financial Goals" },
  { text: "What's one money habit you're working on?", pillarId: null, category: "Financial Goals" },

  // Mindfulness
  { text: "What are you grateful for today?", pillarId: null, category: "Mindfulness" },
  { text: "What emotion is most present right now?", pillarId: null, category: "Mindfulness" },
  { text: "What's one thing you can let go of today?", pillarId: null, category: "Mindfulness" },
  { text: "Where do you feel most at peace?", pillarId: null, category: "Mindfulness" },
  { text: "What's something you accepted today?", pillarId: null, category: "Mindfulness" },

  // Learning
  { text: "What's something you learned recently?", pillarId: null, category: "Learning" },
  { text: "What's a question you've been sitting with?", pillarId: null, category: "Learning" },
  { text: "What's something you'd like to understand better?", pillarId: null, category: "Learning" },
  { text: "What changed your perspective recently?", pillarId: null, category: "Learning" },
  { text: "What book, article, or idea has stuck with you?", pillarId: null, category: "Learning" },
];

async function seed() {
  // Check if prompts already seeded
  const existing = db.select({ total: count() }).from(prompts).get();
  if (existing && existing.total > 0) {
    console.log(`Prompts already seeded (${existing.total} found). Skipping.`);
    return;
  }

  console.log("Seeding prompts...");

  for (const prompt of seedPrompts) {
    db.insert(prompts)
      .values({ text: prompt.text, pillarId: prompt.pillarId })
      .run();
  }

  console.log(`Seeded ${seedPrompts.length} prompts.`);
}

seed();

export { seedPrompts };
