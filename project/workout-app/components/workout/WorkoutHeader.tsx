import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useTranslation } from "react-i18next";

interface WorkoutHeaderProps {
  elapsed: number;
  paused: boolean;
  onTogglePause: () => void;
  onBack: () => void;
  accent?: string;
}

function fmtTime(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function WorkoutHeader({ elapsed, paused, onTogglePause, onBack, accent = tokens.lime }: WorkoutHeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Go back">
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
          <Path d="M1 7L13 7M1 7L6 2M1 7L6 12" stroke={tokens.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onTogglePause}
        style={styles.timerPill}
        accessibilityRole="button"
        accessibilityLabel={paused ? t("workout.active") : t("workout.paused")}
      >
        <View style={[styles.dot, { backgroundColor: paused ? tokens.muted : accent }, !paused && { shadowColor: accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 }]} />
        <View>
          <Text style={styles.statusLabel}>{paused ? t("workout.paused") : t("workout.active")}</Text>
          <Text style={styles.timerText}>{fmtTime(elapsed)}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.iconBtn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SeedsConstants.margin20,
    paddingVertical: SeedsConstants.margin12,
    borderBottomWidth: SeedsConstants.borderWidth1,
    borderBottomColor: tokens.border,
    backgroundColor: tokens.bg0,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: SeedsConstants.borderRadius12,
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    alignItems: "center",
    justifyContent: "center",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin10,
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    borderRadius: 14,
    paddingHorizontal: SeedsConstants.margin14,
    paddingVertical: SeedsConstants.margin8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: SeedsConstants.fontSize9, fontWeight: "600", letterSpacing: 1, color: tokens.muted, textTransform: "uppercase" },
  timerText: { fontSize: SeedsConstants.fontSize18, fontWeight: "800", letterSpacing: SeedsConstants.letterSpacingSnug, color: tokens.text },
});

export { fmtTime };
