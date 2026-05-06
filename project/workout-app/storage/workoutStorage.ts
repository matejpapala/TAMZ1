import AsyncStorage from "@react-native-async-storage/async-storage";
import { Workout, WeightUnit } from "@/types/workout";

const WORKOUTS_KEY = "workouts_v1";
const USER_SETTINGS_KEY = "user_settings_v1";

export interface UserSettings {
  name: string;
  unit: WeightUnit;
  language: string;
}

export async function loadWorkouts(): Promise<Workout[]> {
  const raw = await AsyncStorage.getItem(WORKOUTS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Workout[];
}

export async function saveWorkouts(workouts: Workout[]): Promise<void> {
  await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

export async function loadUserSettings(): Promise<UserSettings> {
  const raw = await AsyncStorage.getItem(USER_SETTINGS_KEY);
  if (!raw) return { name: "", unit: "kg", language: "en" };
  const parsed = JSON.parse(raw) as Partial<UserSettings>;
  return { name: parsed.name ?? "", unit: parsed.unit ?? "kg", language: parsed.language ?? "en" };
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
}
