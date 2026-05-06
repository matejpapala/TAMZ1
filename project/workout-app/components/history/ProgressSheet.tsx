import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Svg, { Path, Circle, Text as SvgText } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { Workout } from "@/types/workout";
import { useHistoryStore } from "@/store/historyStore";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

interface ProgressSheetProps {
  exerciseId: string;
  exerciseName: string;
  onClose: () => void;
  accent?: string;
}

interface DataPoint {
  date: string;
  maxWeightKg: number;
}

function buildProgressData(workouts: Workout[], exerciseId: string): DataPoint[] {
  const points: DataPoint[] = [];
  for (const w of [...workouts].sort((a, b) => a.startedAt - b.startedAt)) {
    const ex = w.exercises.find((e) => e.exerciseId === exerciseId);
    if (!ex) continue;
    const doneSets = ex.sets.filter((s) => s.done && Number(s.weight) > 0);
    if (doneSets.length === 0) continue;
    const maxWeight = Math.max(...doneSets.map((s) => Number(s.weight)));
    points.push({
      date: new Date(w.startedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      maxWeightKg: maxWeight,
    });
  }
  return points;
}

const CHART_W = Dimensions.get("window").width - 2 * SeedsConstants.margin20;
const CHART_H = 120;
const PAD = { top: 8, right: 12, bottom: 24, left: 32 };

function ProgressChart({ points, accent, unit }: { points: DataPoint[]; accent: string; unit: string }) {
  if (points.length < 2) return null;

  const displayPoints = points.map((p) => ({
    ...p,
    displayWeight: unit === "lbs" ? Math.round(p.maxWeightKg * 2.2046) : p.maxWeightKg,
  }));

  const minW = Math.min(...displayPoints.map((p) => p.displayWeight));
  const maxW = Math.max(...displayPoints.map((p) => p.displayWeight));
  const range = maxW - minW || 1;
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;

  const toX = (i: number) => PAD.left + (i / (displayPoints.length - 1)) * innerW;
  const toY = (v: number) => PAD.top + innerH - ((v - minW) / range) * innerH;

  const pathD = displayPoints.map((p, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(p.displayWeight)}`).join(" ");

  return (
    <Svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} style={styles.chart}>
      <Path d={pathD} stroke={accent} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {displayPoints.map((p, i) => (
        <Circle key={i} cx={toX(i)} cy={toY(p.displayWeight)} r={4} fill={accent} />
      ))}
      {[minW, maxW].map((v, i) => (
        <SvgText key={i} x={PAD.left - 4} y={toY(v) + 4} textAnchor="end" fontSize={9} fill={tokens.muted}>
          {v}
        </SvgText>
      ))}
      {displayPoints.map((p, i) =>
        i % Math.max(1, Math.floor(displayPoints.length / 4)) === 0 ? (
          <SvgText key={i} x={toX(i)} y={CHART_H - 4} textAnchor="middle" fontSize={9} fill={tokens.muted}>
            {p.date}
          </SvgText>
        ) : null
      )}
    </Svg>
  );
}

export function ProgressSheet({ exerciseId, exerciseName, onClose, accent = tokens.lime }: ProgressSheetProps) {
  const { t } = useTranslation();
  const workouts = useHistoryStore((s) => s.workouts);
  const unit = useUserStore((s) => s.unit);

  const points = useMemo(() => buildProgressData(workouts, exerciseId), [workouts, exerciseId]);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>{exerciseName}</Text>
          <Text style={styles.subtitle}>{t("history.progressTitle")}</Text>
        </View>

        {points.length < 2 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t("history.progressEmpty")}</Text>
            {points.length === 1 && (
              <Text style={[styles.singlePoint, { color: accent }]}>
                {unit === "lbs" ? Math.round(points[0].maxWeightKg * 2.2046) : points[0].maxWeightKg} {unit}
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.chartWrap}>
            <ProgressChart points={points} accent={accent} unit={unit} />
          </View>
        )}

        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {[...points].reverse().map((p, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.rowDate}>{p.date}</Text>
              <Text style={[styles.rowWeight, { color: i === 0 ? accent : tokens.text }]}>
                {unit === "lbs" ? Math.round(p.maxWeightKg * 2.2046) : p.maxWeightKg} {unit}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 200, justifyContent: "flex-end" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    backgroundColor: tokens.bg1,
    borderTopLeftRadius: SeedsConstants.borderRadius28,
    borderTopRightRadius: SeedsConstants.borderRadius28,
    maxHeight: "75%",
    borderTopWidth: SeedsConstants.borderWidth1,
    borderTopColor: tokens.border2,
    paddingBottom: SeedsConstants.margin28,
  },
  handle: { width: 38, height: 5, borderRadius: 3, backgroundColor: tokens.bg4, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  header: { paddingHorizontal: SeedsConstants.margin20, paddingBottom: SeedsConstants.margin14 },
  title: { fontSize: SeedsConstants.fontSize20, fontWeight: "800", color: tokens.text },
  subtitle: { fontSize: SeedsConstants.fontSize12, color: tokens.muted, marginTop: 2 },
  chartWrap: { paddingHorizontal: SeedsConstants.margin20, marginBottom: SeedsConstants.margin14 },
  chart: { alignSelf: "stretch" },
  empty: { paddingHorizontal: SeedsConstants.margin20, paddingVertical: SeedsConstants.margin14 },
  emptyText: { fontSize: SeedsConstants.fontSize13, color: tokens.muted2, lineHeight: 20 },
  singlePoint: { fontSize: SeedsConstants.fontSize26, fontWeight: "800", marginTop: SeedsConstants.margin8 },
  list: { maxHeight: 200 },
  listContent: { paddingHorizontal: SeedsConstants.margin20 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SeedsConstants.margin10,
    borderBottomWidth: SeedsConstants.borderWidth1,
    borderBottomColor: tokens.border,
  },
  rowDate: { fontSize: SeedsConstants.fontSize14, color: tokens.muted2 },
  rowWeight: { fontSize: SeedsConstants.fontSize14, fontWeight: "700" },
});
