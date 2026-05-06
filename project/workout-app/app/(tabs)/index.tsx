import { ActivityCard, DashboardHeader, HeroWeekCard, StartCTAs, StatChips, TemplatesCard } from "@/components";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useHistoryStore } from "@/store/historyStore";
import { useUserStore } from "@/store/userStore";
import { useActiveWorkoutStore } from "@/store/activeWorkoutStore";
import { BarData, StatChip } from "@/types/dashboard";
import { Workout } from "@/types/workout";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function buildWeeklyData(workouts: Workout[]): BarData[] {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const counts: number[] = [0, 0, 0, 0, 0, 0, 0];
  for (const w of workouts) {
    const d = new Date(w.startedAt);
    if (d >= startOfWeek && d <= now) {
      counts[d.getDay()]++;
    }
  }

  return counts.map((count, i) => ({
    label: DAY_LABELS[i],
    value: count,
    isToday: i === now.getDay(),
  }));
}

function buildMonthlyChips(workouts: Workout[], unit: string): StatChip[] {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthly = workouts.filter((w) => new Date(w.startedAt) >= startOfMonth);
  const totalSets = monthly.reduce(
    (sum, w) => sum + w.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done).length, 0),
    0
  );
  const totalVolumeKg = monthly.reduce(
    (sum, w) =>
      sum +
      w.exercises.reduce(
        (es, e) => es + e.sets.filter((s) => s.done).reduce((ss, s) => ss + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
        0
      ),
    0
  );
  const totalDuration = monthly.reduce((sum, w) => sum + w.duration, 0);
  const avgMinutes = monthly.length > 0 ? Math.round(totalDuration / monthly.length / 60) : 0;
  const displayVolume = unit === "lbs" ? Math.round(totalVolumeKg * 2.2046) : Math.round(totalVolumeKg);
  const volumeLabel = displayVolume >= 1000 ? `${(displayVolume / 1000).toFixed(1)}k ${unit}` : `${displayVolume} ${unit}`;

  return [
    { label: "Workouts", value: String(monthly.length), color: tokens.lime },
    { label: "Total Sets", value: String(totalSets), color: tokens.orange },
    { label: "Avg Time", value: `${avgMinutes}m`, color: tokens.violet },
    { label: "Volume", value: volumeLabel, color: tokens.cyan },
  ];
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const workouts = useHistoryStore((s) => s.workouts);
  const { name, unit } = useUserStore();
  const startWorkout = useActiveWorkoutStore((s) => s.startWorkout);

  const weeklyData = useMemo(() => buildWeeklyData(workouts), [workouts]);
  const monthlyChips = useMemo(() => buildMonthlyChips(workouts, unit), [workouts, unit]);
  const weekWorkoutsCount = useMemo(() => weeklyData.reduce((s, d) => s + (d.value > 0 ? 1 : 0), 0), [weeklyData]);

  const handleStartBlank = () => {
    startWorkout("Workout");
    router.push("/new-workout");
  };

  const handleStartTemplate = () => {
    startWorkout("Workout");
    router.push("/new-workout");
  };

  return (
    <View style={{ flex: 1, backgroundColor: tokens.bg0, paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SeedsConstants.margin24 }}
      >
        <DashboardHeader userName={name || "there"} />
        <StartCTAs onStartBlank={handleStartBlank} onStartTemplate={handleStartTemplate} />
        <HeroWeekCard weeklyData={weeklyData} workoutsCount={weekWorkoutsCount} />
        <StatChips chips={monthlyChips} sectionLabel="This month" />
        <TemplatesCard />
        <ActivityCard />
      </ScrollView>
    </View>
  );
}
