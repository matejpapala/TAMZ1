import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { Workout } from "@/types/workout";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

function fmtDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const { t } = useTranslation();
  const unit = useUserStore((s) => s.unit);

  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done).length, 0);
  const totalVolumeKg = workout.exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.done).reduce((ss, s) => ss + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
    0
  );
  const displayVolume = unit === "lbs" ? Math.round(totalVolumeKg * 2.2046) : Math.round(totalVolumeKg);
  const volumeLabel = displayVolume >= 1000 ? `${(displayVolume / 1000).toFixed(1)}k ${unit}` : `${displayVolume} ${unit}`;

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={workout.title}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.date}>{fmtDate(workout.startedAt)}</Text>
          <Text style={styles.title} numberOfLines={1}>{workout.title}</Text>
          <Text style={styles.sub}>
            {workout.exercises.length} {t("history.exercises")} · {totalSets} {t("history.sets")} · {volumeLabel}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.duration}>{fmtDuration(workout.duration)}</Text>
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path d="M5 3L9 7L5 11" stroke={tokens.muted} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius16,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    padding: SeedsConstants.margin16,
    marginHorizontal: SeedsConstants.margin20,
  },
  row: { flexDirection: "row", alignItems: "center", gap: SeedsConstants.margin12 },
  info: { flex: 1 },
  date: { fontSize: SeedsConstants.fontSize11, color: tokens.muted, fontWeight: "600", letterSpacing: 0.4, marginBottom: 2 },
  title: { fontSize: SeedsConstants.fontSize16, fontWeight: "800", color: tokens.text, letterSpacing: SeedsConstants.letterSpacingSnug },
  sub: { fontSize: SeedsConstants.fontSize12, color: tokens.muted2, marginTop: SeedsConstants.margin4 },
  right: { alignItems: "flex-end", gap: SeedsConstants.margin4 },
  duration: { fontSize: SeedsConstants.fontSize13, fontWeight: "700", color: tokens.muted2 },
});
