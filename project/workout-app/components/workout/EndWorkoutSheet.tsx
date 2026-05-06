import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { WorkoutExercise } from "@/types/workout";
import { useTranslation } from "react-i18next";
import { fmtTime } from "./WorkoutHeader";
import { useUserStore } from "@/store/userStore";

interface EndWorkoutSheetProps {
  exercises: WorkoutExercise[];
  elapsed: number;
  onConfirm: () => void;
  onCancel: () => void;
  accent?: string;
}

export function EndWorkoutSheet({ exercises, elapsed, onConfirm, onCancel, accent = tokens.lime }: EndWorkoutSheetProps) {
  const { t } = useTranslation();
  const unit = useUserStore((s) => s.unit);

  const totalSets = exercises.reduce((s, e) => s + e.sets.filter((x) => x.done).length, 0);
  const totalVolumeKg = exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.done).reduce((ss, s) => ss + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
    0
  );
  const displayVolume = unit === "lbs" ? Math.round(totalVolumeKg * 2.2046) : Math.round(totalVolumeKg);
  const volumeLabel = displayVolume >= 1000 ? `${(displayVolume / 1000).toFixed(1)}k` : String(displayVolume);

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>{t("workout.endTitle")}</Text>
        <Text style={styles.body}>{t("workout.endBody")}</Text>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: accent }]}>{fmtTime(elapsed)}</Text>
            <Text style={styles.summaryLabel}>{t("workout.duration").toUpperCase()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalSets}</Text>
            <Text style={styles.summaryLabel}>{t("workout.sets").toUpperCase()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{volumeLabel}</Text>
            <Text style={styles.summaryLabel}>{unit.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn} accessibilityRole="button" accessibilityLabel={t("workout.keepGoing")}>
            <Text style={styles.cancelText}>{t("workout.keepGoing")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            style={[styles.confirmBtn, { backgroundColor: accent, shadowColor: accent }]}
            accessibilityRole="button"
            accessibilityLabel={t("workout.saveFinish")}
          >
            <Text style={styles.confirmText}>{t("workout.saveFinish")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

interface DiscardSheetProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function DiscardSheet({ onConfirm, onCancel }: DiscardSheetProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>{t("workout.discardTitle")}</Text>
        <Text style={styles.body}>{t("workout.discardBody")}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn} accessibilityRole="button" accessibilityLabel={t("workout.cancel")}>
            <Text style={styles.cancelText}>{t("workout.cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            style={[styles.confirmBtn, { backgroundColor: tokens.red, shadowColor: tokens.red }]}
            accessibilityRole="button"
            accessibilityLabel={t("workout.discardConfirm")}
          >
            <Text style={styles.confirmText}>{t("workout.discardConfirm")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, alignItems: "center", justifyContent: "center", padding: SeedsConstants.margin24, backgroundColor: "rgba(0,0,0,0.7)" },
  modal: {
    width: "100%",
    backgroundColor: tokens.bg1,
    borderRadius: 24,
    padding: SeedsConstants.margin24,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
  },
  title: { fontSize: SeedsConstants.fontSize20, fontWeight: "800", letterSpacing: SeedsConstants.letterSpacingSnug, color: tokens.text },
  body: { fontSize: SeedsConstants.fontSize13, color: tokens.muted2, marginTop: SeedsConstants.margin6, lineHeight: 20 },
  summary: {
    flexDirection: "row",
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius14,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    padding: SeedsConstants.margin14,
    marginTop: SeedsConstants.margin18,
    marginBottom: SeedsConstants.margin4,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontSize: SeedsConstants.fontSize18, fontWeight: "800" },
  summaryLabel: { fontSize: SeedsConstants.fontSize9, color: tokens.muted, fontWeight: "700", marginTop: 3, letterSpacing: 0.6 },
  divider: { width: 1, backgroundColor: tokens.border },
  actions: { flexDirection: "row", gap: SeedsConstants.margin8, marginTop: SeedsConstants.margin14 },
  cancelBtn: { flex: 1, backgroundColor: tokens.bg3, borderWidth: SeedsConstants.borderWidth1, borderColor: tokens.border2, borderRadius: SeedsConstants.borderRadius14, padding: SeedsConstants.margin12, alignItems: "center" },
  cancelText: { fontSize: SeedsConstants.fontSize14, fontWeight: "700", color: tokens.text },
  confirmBtn: { flex: 1.4, borderRadius: SeedsConstants.borderRadius14, padding: SeedsConstants.margin12, alignItems: "center", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: SeedsConstants.shadowRadiusSm, elevation: SeedsConstants.shadowElevationSm },
  confirmText: { fontSize: SeedsConstants.fontSize14, fontWeight: "800", color: tokens.bg0 },
});
