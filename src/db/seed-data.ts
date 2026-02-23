export interface SeedPrompt {
  text: string;
  category: string | null;
}

export const seedPrompts: SeedPrompt[] = [
  // General prompts (no pillar association)
  { text: "What's one thing on your mind right now?", category: null },
  { text: "What would make today a good day?", category: null },
  { text: "What's something you noticed recently?", category: null },
  { text: "What are you looking forward to?", category: null },
  { text: "What's one thing you'd tell yourself a year from now?", category: null },
  { text: "What's taking up most of your mental energy today?", category: null },
  { text: "What's something small that made you smile?", category: null },
  { text: "What would you like to remember about today?", category: null },
  { text: "If today had a theme, what would it be?", category: null },
  { text: "What's one thing you're proud of right now?", category: null },

  // Health & Fitness
  { text: "How does your body feel today?", category: "Health & Fitness" },
  { text: "What's one thing you did for yourself today?", category: "Health & Fitness" },
  { text: "How did you move your body today?", category: "Health & Fitness" },
  { text: "What's one healthy choice you made today?", category: "Health & Fitness" },
  { text: "How's your energy level right now?", category: "Health & Fitness" },

  // Career Growth
  { text: "What's one thing you moved forward today?", category: "Career Growth" },
  { text: "What problem are you trying to solve right now?", category: "Career Growth" },
  { text: "What's a skill you're building?", category: "Career Growth" },
  { text: "What's the most interesting part of your work right now?", category: "Career Growth" },
  { text: "What would you do differently at work tomorrow?", category: "Career Growth" },

  // Relationships
  { text: "Who made an impact on you recently?", category: "Relationships" },
  { text: "What's one thing you're grateful for about someone in your life?", category: "Relationships" },
  { text: "Who have you been thinking about lately?", category: "Relationships" },
  { text: "What's a conversation you'd like to have?", category: "Relationships" },
  { text: "How did you connect with someone today?", category: "Relationships" },

  // Creative Projects
  { text: "What's inspiring you right now?", category: "Creative Projects" },
  { text: "What would you create if you had no constraints?", category: "Creative Projects" },
  { text: "What's a creative idea you've been sitting on?", category: "Creative Projects" },
  { text: "What did you make or build recently?", category: "Creative Projects" },

  // Financial Goals
  { text: "What's one financial decision you're weighing?", category: "Financial Goals" },
  { text: "What does financial peace of mind look like for you?", category: "Financial Goals" },
  { text: "What's one money habit you're working on?", category: "Financial Goals" },

  // Mindfulness
  { text: "What are you grateful for today?", category: "Mindfulness" },
  { text: "What emotion is most present right now?", category: "Mindfulness" },
  { text: "What's one thing you can let go of today?", category: "Mindfulness" },
  { text: "Where do you feel most at peace?", category: "Mindfulness" },
  { text: "What's something you accepted today?", category: "Mindfulness" },

  // Learning
  { text: "What's something you learned recently?", category: "Learning" },
  { text: "What's a question you've been sitting with?", category: "Learning" },
  { text: "What's something you'd like to understand better?", category: "Learning" },
  { text: "What changed your perspective recently?", category: "Learning" },
  { text: "What book, article, or idea has stuck with you?", category: "Learning" },

  // Parenting
  { text: "What moment with your kids stood out today?", category: "Parenting" },
  { text: "What's something your child taught you recently?", category: "Parenting" },
  { text: "How are you growing alongside your kids?", category: "Parenting" },
];
