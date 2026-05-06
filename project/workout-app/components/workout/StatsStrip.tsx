import { StyleSheet, Text, View } from "react-native";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { WorkoutExercise } from "@/types/workout";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/store/userStore";

interface StatsStripProps {
  exercises: WorkoutExercise[];
  accent?: string;
}

export function StatsStrip({ exercises, accent = tokens.lime }: StatsStripProps) {
  const { t } = useTranslation();
  const unit = useUserStore((s) => s.unit);

  const totalSets = exercises.reduce((sum, e) => sum + e.sets.length, 0);
  const completedSets = exercises.reduce((sum, e) => sum + e.sets.filter((s) => s.done).length, 0);
  const totalVolumeKg = exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.done).reduce((ss, s) => ss + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
    0
  );
  const displayVolume = unit === "lbs" ? Math.round(totalVolumeKg * 2.2046) : Math.round(totalVolumeKg);

  return (
    <View style={styles.row}>
      <View style={styles.chip}>
        <Text style={styles.chipLabel}>{t("workout.exercises").toUpperCase()}</Text>
        <Text style={styles.chipValue}>{exercises.length}</Text>
      </View>
      <View style={styles.chip}>
        <Text style={styles.chipLabel}>{t("workout.sets").toUpperCase()}</Text>
        <Text style={styles.chipValue}>
          {completedSets}
          <Text style={styles.chipMuted}>/{totalSets}</Text>
        </Text>
      </View>
      <View style={styles.chip}>
        <Text style={styles.chipLabel}>{t("workout.volume").toUpperCase()}</Text>
        <Text style={[styles.chipValue, { color: accent }]}>
          {displayVolume >= 1000 ? `${(displayVolume / 1000).toFixed(1)}k` : displayVolume}
          <Text style={styles.chipUnit}> {unit}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SeedsConstants.margin10,
    marginHorizontal: SeedsConstants.margin20,
    marginBottom: SeedsConstants.margin18,
  },
  chip: {
    flex: 1,
    backgroundColor: tokens.bg2,
    borderRadius: 14,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    padding: SeedsConstants.margin12,
  },
  chipLabel: { fontSize: SeedsConstants.fontSize11, color: tokens.muted, fontWeight: "600", letterSpacing: 0.5 },
  chipValue: { fontSize: SeedsConstants.fontSize20, fontWeight: "800", letterSpacing: SeedsConstants.letterSpacingSnug, marginTop: 3, color: tokens.text },
  chipMuted: { color: tokens.muted, fontWeight: "600", fontSize: SeedsConstants.fontSize14 },
  chipUnit: { color: tokens.muted, fontWeight: "600", fontSize: SeedsConstants.fontSize11, marginLeft: 2 },
});
