import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useActiveWorkoutStore } from "@/store/activeWorkoutStore";
import { useHistoryStore } from "@/store/historyStore";
import { ExerciseDefinition } from "@/types/workout";
import { WorkoutHeader } from "@/components/workout/WorkoutHeader";
import { StatsStrip } from "@/components/workout/StatsStrip";
import { ExerciseCard } from "@/components/workout/ExerciseCard";
import { WorkoutEmptyState } from "@/components/workout/WorkoutEmptyState";
import { AddExerciseSheet } from "@/components/workout/AddExerciseSheet";
import { EndWorkoutSheet, DiscardSheet } from "@/components/workout/EndWorkoutSheet";
import { RestTimerSheet } from "@/components/workout/RestTimerSheet";
import { ActionBar } from "@/components/workout/ActionBar";
import { Label } from "@/components/Label";

type Sheet = "add" | "end" | "discard" | "rest" | null;

function useElapsed(startedAt: number | null, paused: boolean): number {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!startedAt || paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startedAt, paused]);

  return elapsed;
}

export default function NewWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();

  const { title, startedAt, exercises, expandedId, setTitle, setExpanded, addExercise, removeExercise, updateExercise, discardWorkout, buildWorkout } = useActiveWorkoutStore();
  const addWorkout = useHistoryStore((s) => s.addWorkout);

  const [paused, setPaused] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const elapsed = useElapsed(startedAt, paused);

  const handleAddExercise = (def: ExerciseDefinition) => {
    addExercise(def);
    setSheet(null);
  };

  const handleFinish = async () => {
    const workout = buildWorkout();
    await addWorkout(workout);
    discardWorkout();
    router.back();
  };

  const handleDiscard = () => {
    discardWorkout();
    router.back();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <WorkoutHeader
        elapsed={elapsed}
        paused={paused}
        onTogglePause={() => setPaused((p) => !p)}
        onBack={() => { if (exercises.length > 0) { setSheet("discard"); } else { handleDiscard(); } }}
      />

      <View style={styles.titleArea}>
        <Label>{t("workout.inProgress")}</Label>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          accessibilityLabel="Workout title"
        />
      </View>

      <StatsStrip exercises={exercises} />

      {exercises.length === 0 ? (
        <WorkoutEmptyState onAdd={() => setSheet("add")} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.exerciseList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              expanded={expandedId === ex.id}
              onToggleExpand={() => setExpanded(expandedId === ex.id ? null : ex.id)}
              onUpdate={updateExercise}
              onRemove={() => removeExercise(ex.id)}
              onRestTimer={() => setSheet("rest")}
            />
          ))}
        </ScrollView>
      )}

      <ActionBar
        onAdd={() => setSheet("add")}
        onEnd={() => setSheet("end")}
        onDiscard={() => setSheet("discard")}
      />

      {sheet === "add" && <AddExerciseSheet onAdd={handleAddExercise} onClose={() => setSheet(null)} />}
      {sheet === "end" && <EndWorkoutSheet exercises={exercises} elapsed={elapsed} onConfirm={handleFinish} onCancel={() => setSheet(null)} />}
      {sheet === "discard" && <DiscardSheet onConfirm={handleDiscard} onCancel={() => setSheet(null)} />}
      {sheet === "rest" && <RestTimerSheet onClose={() => setSheet(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.bg0 },
  titleArea: { paddingHorizontal: SeedsConstants.margin20, paddingTop: SeedsConstants.margin18, paddingBottom: SeedsConstants.margin6 },
  titleInput: {
    backgroundColor: "transparent",
    color: tokens.text,
    fontSize: SeedsConstants.fontSize26,
    fontWeight: "800",
    letterSpacing: SeedsConstants.letterSpacingSnug,
    marginTop: SeedsConstants.margin4,
    paddingVertical: 0,
  },
  exerciseList: { paddingHorizontal: SeedsConstants.margin20, paddingBottom: SeedsConstants.margin20, gap: SeedsConstants.margin10 },
});
