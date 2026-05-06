import { create } from "zustand";
import { WorkoutExercise, WorkoutSet, ExerciseDefinition, Workout } from "@/types/workout";

interface ActiveWorkoutState {
  isActive: boolean;
  title: string;
  startedAt: number | null;
  exercises: WorkoutExercise[];
  expandedId: string | null;
  startWorkout: (title?: string) => void;
  discardWorkout: () => void;
  buildWorkout: () => Workout;
  addExercise: (def: ExerciseDefinition) => void;
  removeExercise: (id: string) => void;
  updateExercise: (exercise: WorkoutExercise) => void;
  setExpanded: (id: string | null) => void;
  setTitle: (title: string) => void;
}

const makeSet = (partial?: Partial<WorkoutSet>): WorkoutSet => ({
  id: Math.random().toString(36).slice(2),
  weight: "",
  reps: "",
  intensity: "working",
  done: false,
  ...partial,
});

export const useActiveWorkoutStore = create<ActiveWorkoutState>((set, get) => ({
  isActive: false,
  title: "Workout",
  startedAt: null,
  exercises: [],
  expandedId: null,

  startWorkout: (title = "Workout") => {
    set({ isActive: true, title, startedAt: Date.now(), exercises: [], expandedId: null });
  },

  discardWorkout: () => {
    set({ isActive: false, title: "Workout", startedAt: null, exercises: [], expandedId: null });
  },

  buildWorkout: () => {
    const { title, startedAt, exercises } = get();
    const endedAt = Date.now();
    const duration = Math.floor((endedAt - (startedAt ?? endedAt)) / 1000);
    return {
      id: Math.random().toString(36).slice(2),
      title,
      startedAt: startedAt ?? endedAt,
      endedAt,
      duration,
      exercises,
    };
  },

  addExercise: (def) => {
    const id = Math.random().toString(36).slice(2);
    const exercise: WorkoutExercise = {
      id,
      exerciseId: def.id,
      name: def.name,
      muscle: def.muscle,
      icon: def.icon,
      color: def.color,
      sets: [makeSet()],
    };
    set((s) => ({ exercises: [...s.exercises, exercise], expandedId: id }));
  },

  removeExercise: (id) => {
    set((s) => ({ exercises: s.exercises.filter((e) => e.id !== id) }));
  },

  updateExercise: (updated) => {
    set((s) => ({ exercises: s.exercises.map((e) => (e.id === updated.id ? updated : e)) }));
  },

  setExpanded: (id) => set({ expandedId: id }),

  setTitle: (title) => set({ title }),
}));

export { makeSet };
