import { create } from "zustand";
import { Workout } from "@/types/workout";
import { loadWorkouts, saveWorkouts } from "@/storage/workoutStorage";

interface HistoryState {
  workouts: Workout[];
  loadWorkouts: () => Promise<void>;
  addWorkout: (workout: Workout) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  workouts: [],

  loadWorkouts: async () => {
    const workouts = await loadWorkouts();
    set({ workouts });
  },

  addWorkout: async (workout) => {
    const workouts = [workout, ...get().workouts];
    set({ workouts });
    await saveWorkouts(workouts);
  },

  updateWorkout: async (updated) => {
    const workouts = get().workouts.map((w) => (w.id === updated.id ? updated : w));
    set({ workouts });
    await saveWorkouts(workouts);
  },

  deleteWorkout: async (id) => {
    const workouts = get().workouts.filter((w) => w.id !== id);
    set({ workouts });
    await saveWorkouts(workouts);
  },
}));
