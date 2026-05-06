import "@/i18n";
import { Stack } from "expo-router";
import { tokens } from "@/theme/tokens";
import { useEffect } from "react";
import { useHistoryStore } from "@/store/historyStore";
import { useUserStore } from "@/store/userStore";

export default function RootLayout() {
  const loadWorkouts = useHistoryStore((s) => s.loadWorkouts);
  const loadSettings = useUserStore((s) => s.loadSettings);

  useEffect(() => {
    loadWorkouts();
    loadSettings();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.bg0 },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="new-workout" options={{ headerShown: false, animation: "slide_from_bottom" }} />
      <Stack.Screen name="workout/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="templates" options={{ headerShown: false }} />
    </Stack>
  );
}
