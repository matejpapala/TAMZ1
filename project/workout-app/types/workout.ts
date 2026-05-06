export type IntensityLevel = "warmup" | "easy" | "working" | "hard" | "failure";
export type WeightUnit = "kg" | "lbs";

export interface WorkoutSet {
  id: string;
  weight: string;
  reps: string;
  intensity: IntensityLevel;
  done: boolean;
  note?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  muscle: string;
  icon: string;
  color: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  title: string;
  startedAt: number;
  endedAt: number;
  duration: number;
  exercises: WorkoutExercise[];
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  muscle: string;
  icon: string;
  color: string;
  category: string;
}
