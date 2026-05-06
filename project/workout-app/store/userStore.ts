import { create } from "zustand";
import { WeightUnit } from "@/types/workout";
import { loadUserSettings, saveUserSettings } from "@/storage/workoutStorage";
import i18n from "@/i18n";

interface UserState {
  name: string;
  unit: WeightUnit;
  language: string;
  loadSettings: () => Promise<void>;
  setName: (name: string) => Promise<void>;
  setUnit: (unit: WeightUnit) => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  name: "",
  unit: "kg",
  language: "en",

  loadSettings: async () => {
    const s = await loadUserSettings();
    set({ name: s.name, unit: s.unit, language: s.language });
    await i18n.changeLanguage(s.language);
  },

  setName: async (name) => {
    set({ name });
    await saveUserSettings({ name, unit: get().unit, language: get().language });
  },

  setUnit: async (unit) => {
    set({ unit });
    await saveUserSettings({ name: get().name, unit, language: get().language });
  },

  setLanguage: async (language) => {
    set({ language });
    await i18n.changeLanguage(language);
    await saveUserSettings({ name: get().name, unit: get().unit, language });
  },
}));
