import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useTranslation } from "react-i18next";

interface WorkoutEmptyStateProps {
  onAdd: () => void;
  accent?: string;
}

export function WorkoutEmptyState({ onAdd, accent = tokens.lime }: WorkoutEmptyStateProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
          <Rect x={6} y={14} width={6} height={8} rx={1.5} fill={tokens.muted2} />
          <Rect x={24} y={14} width={6} height={8} rx={1.5} fill={tokens.muted2} />
          <Rect x={12} y={16} width={12} height={4} rx={1} fill={tokens.muted2} />
          <Rect x={3} y={16} width={3} height={4} rx={0.8} fill={tokens.muted} />
          <Rect x={30} y={16} width={3} height={4} rx={0.8} fill={tokens.muted} />
        </Svg>
      </View>
      <Text style={styles.title}>{t("workout.emptyTitle")}</Text>
      <Text style={styles.body}>{t("workout.emptyBody")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: SeedsConstants.margin28 },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SeedsConstants.margin20,
    borderStyle: "dashed",
  },
  title: { fontSize: SeedsConstants.fontSize18, fontWeight: "800", color: tokens.text, letterSpacing: SeedsConstants.letterSpacingSnug },
  body: { fontSize: SeedsConstants.fontSize13, color: tokens.muted2, marginTop: SeedsConstants.margin6, textAlign: "center", lineHeight: 20, maxWidth: 240 },
});
