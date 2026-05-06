import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useHistoryStore } from "@/store/historyStore";
import { useUserStore } from "@/store/userStore";
import { Workout, WorkoutExercise, WorkoutSet } from "@/types/workout";
import { Label } from "@/components/Label";
import { SetRow, SetTableHeader } from "@/components/workout/SetRow";
import { ProgressSheet } from "@/components/history/ProgressSheet";
import { makeSet } from "@/store/activeWorkoutStore";

function fmtDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function fmtDuration(s: number): string {
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default function WorkoutDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { workouts, updateWorkout, deleteWorkout } = useHistoryStore();
  const unit = useUserStore((s) => s.unit);

  const original = workouts.find((w) => w.id === id);

  const [workout, setWorkout] = useState<Workout | undefined>(original ? { ...original, exercises: original.exercises.map((e) => ({ ...e, sets: [...e.sets] })) } : undefined);
  const [dirty, setDirty] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [progressExercise, setProgressExercise] = useState<{ id: string; name: string } | null>(null);

  if (!workout) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>Workout not found.</Text>
      </View>
    );
  }

  const totalSets = workout.exercises.reduce((s, e) => s + e.sets.filter((x) => x.done).length, 0);
  const totalVolumeKg = workout.exercises.reduce(
    (sum, e) => sum + e.sets.filter((s) => s.done).reduce((ss, s) => ss + (Number(s.weight) || 0) * (Number(s.reps) || 0), 0),
    0
  );
  const displayVolume = unit === "lbs" ? Math.round(totalVolumeKg * 2.2046) : Math.round(totalVolumeKg);
  const volumeLabel = displayVolume >= 1000 ? `${(displayVolume / 1000).toFixed(1)}k ${unit}` : `${displayVolume} ${unit}`;

  const updateExercise = (updated: WorkoutExercise) => {
    setWorkout((w) => w && { ...w, exercises: w.exercises.map((e) => (e.id === updated.id ? updated : e)) });
    setDirty(true);
  };

  const handleSave = async () => {
    await updateWorkout(workout);
    setDirty(false);
  };

  const handleDelete = () => {
    Alert.alert(t("history.delete"), t("history.deleteConfirm"), [
      { text: t("history.cancel"), style: "cancel" },
      {
        text: t("history.deleteAction"),
        style: "destructive",
        onPress: async () => {
          await deleteWorkout(workout.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path d="M1 7L13 7M1 7L6 2M1 7L6 12" stroke={tokens.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <TextInput
          style={styles.titleInput}
          value={workout.title}
          onChangeText={(v) => { setWorkout((w) => w && { ...w, title: v }); setDirty(true); }}
          accessibilityLabel="Workout title"
        />
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn} accessibilityRole="button" accessibilityLabel={t("history.delete")}>
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path d="M3 4.5H13M6 4.5V3A1 1 0 017 2H9A1 1 0 0110 3V4.5M4.5 4.5L5 14A1 1 0 006 15H10A1 1 0 0011 14L11.5 4.5" stroke={tokens.red} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.date}>{fmtDate(workout.startedAt)}</Text>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{fmtDuration(workout.duration)}</Text>
            <Label style={styles.summaryLabel}>Duration</Label>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalSets}</Text>
            <Label style={styles.summaryLabel}>{t("history.sets")}</Label>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: tokens.lime }]}>{volumeLabel}</Text>
            <Label style={styles.summaryLabel}>Volume</Label>
          </View>
        </View>

        {workout.exercises.map((ex) => (
          <View key={ex.id} style={styles.exerciseSection}>
            <TouchableOpacity
              onPress={() => setProgressExercise({ id: ex.exerciseId, name: ex.name })}
              style={styles.exerciseHeader}
              accessibilityRole="button"
              accessibilityLabel={`View ${ex.name} progress`}
            >
              <View style={[styles.exerciseIcon, { backgroundColor: ex.color + "22", borderColor: ex.color + "44" }]}>
                <Text style={styles.exerciseEmoji}>{ex.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseMuscle}>{ex.muscle} · {t("history.progress")}</Text>
              </View>
              <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                <Path d="M2 11L5 7L8 9L12 4" stroke={tokens.lime} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>

            {ex.sets.length > 0 && (
              <View style={styles.setsTable}>
                <SetTableHeader />
                {ex.sets.map((s, i) => (
                  <SetRow
                    key={s.id}
                    set={s}
                    index={i}
                    onChange={(updated: WorkoutSet) => {
                      const updatedSets = ex.sets.map((x, j) => (j === i ? updated : x));
                      updateExercise({ ...ex, sets: updatedSets });
                    }}
                    onToggle={() => {
                      const updatedSets = ex.sets.map((x, j) => (j === i ? { ...x, done: !x.done } : x));
                      updateExercise({ ...ex, sets: updatedSets });
                    }}
                  />
                ))}
                <TouchableOpacity
                  onPress={() => updateExercise({ ...ex, sets: [...ex.sets, makeSet()] })}
                  style={styles.addSetBtn}
                  accessibilityRole="button"
                  accessibilityLabel={t("workout.addSet")}
                >
                  <Text style={styles.addSetText}>{t("workout.addSet")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {dirty && (
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn} accessibilityRole="button" accessibilityLabel={t("history.save")}>
          <Text style={styles.saveBtnText}>{t("history.save")}</Text>
        </TouchableOpacity>
      )}

      {progressExercise && (
        <ProgressSheet
          exerciseId={progressExercise.id}
          exerciseName={progressExercise.name}
          onClose={() => setProgressExercise(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.bg0 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin12,
    paddingHorizontal: SeedsConstants.margin20,
    paddingVertical: SeedsConstants.margin12,
    borderBottomWidth: SeedsConstants.borderWidth1,
    borderBottomColor: tokens.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: SeedsConstants.borderRadius12,
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    alignItems: "center",
    justifyContent: "center",
  },
  titleInput: { flex: 1, fontSize: SeedsConstants.fontSize18, fontWeight: "800", color: tokens.text, letterSpacing: SeedsConstants.letterSpacingSnug },
  deleteBtn: { padding: SeedsConstants.margin8 },
  content: { paddingHorizontal: SeedsConstants.margin20, paddingBottom: SeedsConstants.margin64 },
  date: { fontSize: SeedsConstants.fontSize12, color: tokens.muted, marginTop: SeedsConstants.margin14, marginBottom: SeedsConstants.margin12 },
  summary: {
    flexDirection: "row",
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius16,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    padding: SeedsConstants.margin14,
    marginBottom: SeedsConstants.margin20,
    gap: SeedsConstants.margin8,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { fontSize: SeedsConstants.fontSize20, fontWeight: "800", color: tokens.text },
  summaryLabel: { marginTop: SeedsConstants.margin4, fontSize: SeedsConstants.fontSize9, textAlign: "center" },
  exerciseSection: { marginBottom: SeedsConstants.margin16 },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin12,
    paddingVertical: SeedsConstants.margin10,
  },
  exerciseIcon: { width: 38, height: 38, borderRadius: 11, borderWidth: SeedsConstants.borderWidth1, alignItems: "center", justifyContent: "center" },
  exerciseEmoji: { fontSize: 16 },
  exerciseName: { fontSize: SeedsConstants.fontSize15, fontWeight: "700", color: tokens.text },
  exerciseMuscle: { fontSize: SeedsConstants.fontSize12, color: tokens.lime, marginTop: 2 },
  setsTable: {
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius12,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    paddingHorizontal: SeedsConstants.margin12,
    paddingBottom: SeedsConstants.margin8,
  },
  addSetBtn: {
    padding: SeedsConstants.margin10,
    alignItems: "center",
    marginTop: SeedsConstants.margin4,
    borderTopWidth: SeedsConstants.borderWidth1,
    borderTopColor: tokens.border,
  },
  addSetText: { fontSize: SeedsConstants.fontSize12, fontWeight: "700", color: tokens.muted2 },
  notFound: { flex: 1, color: tokens.muted, textAlign: "center", marginTop: 80 },
  saveBtn: {
    margin: SeedsConstants.margin20,
    backgroundColor: tokens.lime,
    borderRadius: SeedsConstants.borderRadius16,
    padding: SeedsConstants.margin14,
    alignItems: "center",
    shadowColor: tokens.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  saveBtnText: { fontSize: SeedsConstants.fontSize15, fontWeight: "800", color: tokens.bg0 },
});
