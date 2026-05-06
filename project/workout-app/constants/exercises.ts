import { tokens } from "@/theme/tokens";
import { ExerciseDefinition } from "@/types/workout";

export const EXERCISES: ExerciseDefinition[] = [
  { id: "bench-press",       name: "Bench Press",        muscle: "Chest",          icon: "🏋️", color: tokens.orange, category: "Chest" },
  { id: "incline-db-press",  name: "Incline DB Press",   muscle: "Chest",          icon: "🏋️", color: tokens.orange, category: "Chest" },
  { id: "cable-fly",         name: "Cable Fly",          muscle: "Chest",          icon: "🏋️", color: tokens.orange, category: "Chest" },
  { id: "chest-dip",         name: "Chest Dip",          muscle: "Chest",          icon: "💪", color: tokens.orange, category: "Chest" },

  { id: "pullup",            name: "Pull-up",            muscle: "Back",           icon: "💪", color: tokens.lime,   category: "Back" },
  { id: "barbell-row",       name: "Barbell Row",        muscle: "Back",           icon: "🏋️", color: tokens.lime,   category: "Back" },
  { id: "lat-pulldown",      name: "Lat Pulldown",       muscle: "Back",           icon: "💪", color: tokens.lime,   category: "Back" },
  { id: "seated-cable-row",  name: "Seated Cable Row",   muscle: "Back",           icon: "💪", color: tokens.lime,   category: "Back" },

  { id: "overhead-press",    name: "Overhead Press",     muscle: "Shoulders",      icon: "🏋️", color: tokens.cyan,   category: "Shoulders" },
  { id: "lateral-raise",     name: "Lateral Raise",      muscle: "Shoulders",      icon: "🏋️", color: tokens.cyan,   category: "Shoulders" },
  { id: "face-pull",         name: "Face Pull",          muscle: "Rear Delts",     icon: "💪", color: tokens.cyan,   category: "Shoulders" },

  { id: "squat",             name: "Squat",              muscle: "Quads · Glutes", icon: "🦵", color: tokens.violet, category: "Legs" },
  { id: "romanian-dl",       name: "Romanian Deadlift",  muscle: "Hamstrings",     icon: "🦵", color: tokens.violet, category: "Legs" },
  { id: "leg-press",         name: "Leg Press",          muscle: "Quads",          icon: "🦵", color: tokens.violet, category: "Legs" },
  { id: "leg-curl",          name: "Leg Curl",           muscle: "Hamstrings",     icon: "🦵", color: tokens.violet, category: "Legs" },
  { id: "calf-raise",        name: "Calf Raise",         muscle: "Calves",         icon: "🦵", color: tokens.violet, category: "Legs" },

  { id: "bicep-curl",        name: "Bicep Curl",         muscle: "Biceps",         icon: "💪", color: tokens.lime,   category: "Arms" },
  { id: "hammer-curl",       name: "Hammer Curl",        muscle: "Biceps",         icon: "💪", color: tokens.lime,   category: "Arms" },
  { id: "tricep-pushdown",   name: "Tricep Pushdown",    muscle: "Triceps",        icon: "💪", color: tokens.orange, category: "Arms" },
  { id: "skull-crusher",     name: "Skull Crusher",      muscle: "Triceps",        icon: "🏋️", color: tokens.orange, category: "Arms" },

  { id: "deadlift",          name: "Deadlift",           muscle: "Back · Legs",    icon: "⚡", color: tokens.violet, category: "Full Body" },
  { id: "farmers-walk",      name: "Farmer's Walk",      muscle: "Full Body",      icon: "⚡", color: tokens.violet, category: "Full Body" },
  { id: "kettlebell-swing",  name: "Kettlebell Swing",   muscle: "Full Body",      icon: "⚡", color: tokens.violet, category: "Full Body" },

  { id: "plank",             name: "Plank",              muscle: "Core",           icon: "🧘", color: tokens.cyan,   category: "Core" },
  { id: "ab-rollout",        name: "Ab Rollout",         muscle: "Core",           icon: "🧘", color: tokens.cyan,   category: "Core" },
  { id: "cable-crunch",      name: "Cable Crunch",       muscle: "Core",           icon: "🧘", color: tokens.cyan,   category: "Core" },
];

export const EXERCISE_CATEGORIES = ["Chest", "Back", "Shoulders", "Legs", "Arms", "Full Body", "Core"] as const;
