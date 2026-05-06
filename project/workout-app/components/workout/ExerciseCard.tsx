import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { WorkoutExercise, WorkoutSet } from "@/types/workout";
import { useTranslation } from "react-i18next";
import { SetRow, SetTableHeader } from "./SetRow";
import { NoteInput } from "./NoteInput";
import { makeSet } from "@/store/activeWorkoutStore";
import { useState } from "react";

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (exercise: WorkoutExercise) => void;
  onRemove: () => void;
  onRestTimer: () => void;
  accent?: string;
}

export function ExerciseCard({ exercise, expanded, onToggleExpand, onUpdate, onRemove, onRestTimer, accent = tokens.lime }: ExerciseCardProps) {
  const { t } = useTranslation();
  const [showNote, setShowNote] = useState(false);
  const sets = exercise.sets;
  const completedSets = sets.filter((s) => s.done).length;

  const updateSet = (i: number, updated: WorkoutSet) => {
    const next = [...sets];
    next[i] = updated;
    onUpdate({ ...exercise, sets: next });
  };

  const toggleSet = (i: number) => {
    const next = [...sets];
    next[i] = { ...next[i], done: !next[i].done };
    onUpdate({ ...exercise, sets: next });
  };

  const addSet = () => {
    const last = sets[sets.length - 1];
    const newSet = last
      ? makeSet({ weight: last.weight, reps: last.reps, rpe: last.rpe })
      : makeSet();
    onUpdate({ ...exercise, sets: [...sets, newSet] });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onToggleExpand} style={styles.header} accessibilityRole="button" accessibilityLabel={`${exercise.name}, ${expanded ? "collapse" : "expand"}`}>
        <View style={[styles.iconWrap, { backgroundColor: exercise.color + "22", borderColor: exercise.color + "44" }]}>
          <Text style={styles.icon}>{exercise.icon}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>{exercise.name}</Text>
          <Text style={styles.muscle}>
            {exercise.muscle}{sets.length > 0 ? ` · ${completedSets}/${sets.length} sets` : ""}
          </Text>
        </View>
        {sets.length > 0 && !expanded && (
          <View style={styles.dots}>
            {sets.map((s, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: s.done ? accent : tokens.bg3 }]} />
            ))}
          </View>
        )}
        <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}>
          <Path d="M3 5L7 9L11 5" stroke={tokens.muted2} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          {sets.length > 0 && <SetTableHeader />}
          {sets.map((s, i) => (
            <SetRow key={s.id} set={s} index={i} onChange={(ns) => updateSet(i, ns)} onToggle={() => toggleSet(i)} />
          ))}

          <TouchableOpacity
            onPress={addSet}
            style={styles.addSetBtn}
            accessibilityRole="button"
            accessibilityLabel={t("workout.addSet")}
          >
            <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <Path d="M7 1V13M1 7H13" stroke={tokens.muted2} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
            <Text style={styles.addSetText}>{t("workout.addSet")}</Text>
          </TouchableOpacity>

          {showNote && (
            <NoteInput
              value={exercise.sets[0]?.note ?? ""}
              onChange={(v) => onUpdate({ ...exercise, sets: sets.map((s, i) => (i === 0 ? { ...s, note: v } : s)) })}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => setShowNote((v) => !v)}
              style={styles.footerBtn}
              accessibilityRole="button"
              accessibilityLabel={t("workout.note")}
            >
              <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <Path d="M6 1V11M1 6H11" stroke={tokens.muted} strokeWidth={1.5} strokeLinecap="round" />
              </Svg>
              <Text style={styles.footerBtnText}>{t("workout.note")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRestTimer}
              style={styles.footerBtn}
              accessibilityRole="button"
              accessibilityLabel={t("workout.restTimer")}
            >
              <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <Path d="M6 1C3.24 1 1 3.24 1 6s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" stroke={tokens.muted} strokeWidth={1.5} />
                <Path d="M6 3.5V6.5L7.5 8" stroke={tokens.muted} strokeWidth={1.5} strokeLinecap="round" />
              </Svg>
              <Text style={styles.footerBtnText}>{t("workout.restTimer")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRemove}
              style={styles.footerBtn}
              accessibilityRole="button"
              accessibilityLabel={t("workout.remove")}
            >
              <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <Path d="M2 3H10M4.5 3V2A1 1 0 015.5 1H6.5A1 1 0 017.5 2V3M3 3L3.5 10A1 1 0 004.5 11H7.5A1 1 0 008.5 10L9 3" stroke={tokens.red} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={[styles.footerBtnText, { color: tokens.red }]}>{t("workout.remove")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.bg2,
    borderRadius: 18,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin12,
    padding: SeedsConstants.margin14,
  },
  iconWrap: { width: 42, height: 42, borderRadius: SeedsConstants.borderRadius12, borderWidth: SeedsConstants.borderWidth1, alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 18 },
  headerText: { flex: 1, minWidth: 0 },
  name: { fontSize: SeedsConstants.fontSize15, fontWeight: "700", color: tokens.text },
  muscle: { fontSize: SeedsConstants.fontSize12, color: tokens.muted, marginTop: 2 },
  dots: { flexDirection: "row", gap: 3, marginRight: SeedsConstants.margin6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  body: { paddingHorizontal: SeedsConstants.margin16, paddingBottom: SeedsConstants.margin14, borderTopWidth: SeedsConstants.borderWidth1, borderTopColor: tokens.border },
  addSetBtn: {
    width: "100%",
    backgroundColor: tokens.bg3,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    borderRadius: 10,
    padding: SeedsConstants.margin10,
    marginTop: SeedsConstants.margin10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SeedsConstants.margin6,
    borderStyle: "dashed",
  },
  addSetText: { fontSize: SeedsConstants.fontSize13, fontWeight: "700", color: tokens.muted2 },
  footer: { flexDirection: "row", gap: SeedsConstants.margin8, marginTop: SeedsConstants.margin10 },
  footerBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, padding: SeedsConstants.margin4 },
  footerBtnText: { fontSize: SeedsConstants.fontSize12, fontWeight: "600", color: tokens.muted },
});
