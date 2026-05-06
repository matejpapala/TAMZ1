import { create } from "zustand";
import { WeightUnit } from "@/types/workout";
import { loadUserSettings, saveUserSettings } from "@/storage/workoutStorage";

interface UserState {
  name: string;
  unit: WeightUnit;
  loadSettings: () => Promise<void>;
  setName: (name: string) => Promise<void>;
  setUnit: (unit: WeightUnit) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  name: "",
  unit: "kg",

  loadSettings: async () => {
    const s = await loadUserSettings();
    set({ name: s.name, unit: s.unit });
  },

  setName: async (name) => {
    set({ name });
    await saveUserSettings({ name, unit: get().unit });
  },

  setUnit: async (unit) => {
    set({ unit });
    await saveUserSettings({ name: get().name, unit });
  },
}));
