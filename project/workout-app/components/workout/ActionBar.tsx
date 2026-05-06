import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useTranslation } from "react-i18next";

interface ActionBarProps {
  onAdd: () => void;
  onEnd: () => void;
  onDiscard: () => void;
  accent?: string;
}

export function ActionBar({ onAdd, onEnd, onDiscard, accent = tokens.lime }: ActionBarProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onAdd}
        style={[styles.addBtn, { backgroundColor: accent, shadowColor: accent }]}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={t("workout.addExercise")}
      >
        <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <Path d="M9 2V16M2 9H16" stroke={tokens.bg0} strokeWidth={2.4} strokeLinecap="round" />
        </Svg>
        <Text style={styles.addText}>{t("workout.addExercise")}</Text>
      </TouchableOpacity>

      <View style={styles.secondRow}>
        <TouchableOpacity
          onPress={onDiscard}
          style={styles.discardBtn}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t("workout.discard")}
        >
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path d="M2 3.5H12M5 3.5V2A1 1 0 016 1H8A1 1 0 019 2V3.5M3.5 3.5L4 12A1.2 1.2 0 005.2 13H8.8A1.2 1.2 0 0010 12L10.5 3.5" stroke={tokens.muted2} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.discardText}>{t("workout.discard")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onEnd}
          style={styles.endBtn}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={t("workout.endWorkout")}
        >
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path d="M2 2H12V12H2Z" fill="white" />
          </Svg>
          <Text style={styles.endText}>{t("workout.endWorkout")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: SeedsConstants.borderWidth1,
    borderTopColor: tokens.border,
    backgroundColor: tokens.bg1,
    paddingHorizontal: SeedsConstants.margin16,
    paddingTop: SeedsConstants.margin12,
    paddingBottom: SeedsConstants.margin24,
  },
  addBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SeedsConstants.margin8,
    borderRadius: SeedsConstants.borderRadius16,
    padding: SeedsConstants.margin14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: SeedsConstants.shadowRadiusLg,
    elevation: SeedsConstants.shadowElevationLg,
  },
  addText: { fontSize: SeedsConstants.fontSize15, fontWeight: "800", color: tokens.bg0, letterSpacing: SeedsConstants.letterSpacingSnug },
  secondRow: { flexDirection: "row", gap: SeedsConstants.margin8, marginTop: SeedsConstants.margin10 },
  discardBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SeedsConstants.margin6,
    backgroundColor: tokens.bg3,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    borderRadius: SeedsConstants.borderRadius14,
    padding: SeedsConstants.margin12,
  },
  discardText: { fontSize: SeedsConstants.fontSize13, fontWeight: "700", color: tokens.muted2 },
  endBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SeedsConstants.margin6,
    backgroundColor: tokens.red,
    borderRadius: SeedsConstants.borderRadius14,
    padding: SeedsConstants.margin12,
  },
  endText: { fontSize: SeedsConstants.fontSize13, fontWeight: "800", color: "#fff", letterSpacing: 0.2 },
});
