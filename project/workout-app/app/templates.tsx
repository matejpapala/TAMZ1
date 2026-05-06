import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Svg, { Path, Rect } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { EXERCISES } from "@/constants/exercises";
import { useActiveWorkoutStore } from "@/store/activeWorkoutStore";
import { makeSet } from "@/store/activeWorkoutStore";
import { WorkoutExercise } from "@/types/workout";

interface TemplateExercise {
  exerciseId: string;
  sets: number;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: TemplateExercise[];
}

const TEMPLATES: WorkoutTemplate[] = [
  {
    id: "upper-body-blast",
    name: "Upper Body Blast",
    description: "Classic push/pull upper body routine",
    exercises: [
      { exerciseId: "bench-press", sets: 3 },
      { exerciseId: "pullup", sets: 3 },
      { exerciseId: "overhead-press", sets: 3 },
    ],
  },
];

function buildExercises(template: WorkoutTemplate): WorkoutExercise[] {
  return template.exercises.flatMap((te) => {
    const def = EXERCISES.find((e) => e.id === te.exerciseId);
    if (!def) return [];
    return [{
      id: Math.random().toString(36).slice(2),
      exerciseId: def.id,
      name: def.name,
      muscle: def.muscle,
      icon: def.icon,
      color: def.color,
      sets: Array.from({ length: te.sets }, () => makeSet()),
    }];
  });
}

export default function TemplatesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { startWorkout, loadExercises } = useActiveWorkoutStore();

  const handleStart = (template: WorkoutTemplate) => {
    startWorkout(template.name);
    loadExercises(buildExercises(template));
    router.push("/new-workout");
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
          <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
            <Path d="M1 7L13 7M1 7L6 2M1 7L6 12" stroke={tokens.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.title}>Templates</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {TEMPLATES.map((template) => {
          const exerciseDefs = template.exercises.flatMap((te) => {
            const def = EXERCISES.find((e) => e.id === te.exerciseId);
            return def ? [{ ...def, sets: te.sets }] : [];
          });

          return (
            <View key={template.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                    <Rect x={2.5} y={3} width={15} height={14} rx={3} stroke={tokens.violet} strokeWidth={1.6} />
                    <Path d="M6 8H14M6 11.5H11" stroke={tokens.violet} strokeWidth={1.6} strokeLinecap="round" />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{template.name}</Text>
                  <Text style={styles.cardDesc}>{template.description}</Text>
                </View>
              </View>

              <View style={styles.exerciseList}>
                {exerciseDefs.map((ex) => (
                  <View key={ex.id} style={styles.exerciseRow}>
                    <View style={[styles.exerciseIcon, { backgroundColor: ex.color + "22", borderColor: ex.color + "44" }]}>
                      <Text style={styles.exerciseEmoji}>{ex.icon}</Text>
                    </View>
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                    <Text style={styles.exerciseSets}>{ex.sets} sets</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => handleStart(template)}
                style={styles.startBtn}
                accessibilityRole="button"
                accessibilityLabel={`Start ${template.name}`}
              >
                <Text style={styles.startBtnText}>Start Workout</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
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
  title: { flex: 1, fontSize: SeedsConstants.fontSize18, fontWeight: "800", color: tokens.text, textAlign: "center" },
  content: { padding: SeedsConstants.margin20, gap: SeedsConstants.margin16 },
  card: {
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius20,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    padding: SeedsConstants.margin16,
    gap: SeedsConstants.margin14,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: SeedsConstants.margin12 },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: SeedsConstants.borderRadius12,
    backgroundColor: tokens.violet + "22",
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.violet + "44",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: SeedsConstants.fontSize18, fontWeight: "800", color: tokens.text },
  cardDesc: { fontSize: SeedsConstants.fontSize12, color: tokens.muted, marginTop: 2 },
  exerciseList: { gap: SeedsConstants.margin8 },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin10,
    backgroundColor: tokens.bg3,
    borderRadius: SeedsConstants.borderRadius12,
    padding: SeedsConstants.margin10,
  },
  exerciseIcon: {
    width: 32,
    height: 32,
    borderRadius: SeedsConstants.borderRadius8,
    borderWidth: SeedsConstants.borderWidth1,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseEmoji: { fontSize: 14 },
  exerciseName: { flex: 1, fontSize: SeedsConstants.fontSize14, fontWeight: "600", color: tokens.text },
  exerciseSets: { fontSize: SeedsConstants.fontSize12, color: tokens.muted2, fontWeight: "600" },
  startBtn: {
    backgroundColor: tokens.lime,
    borderRadius: SeedsConstants.borderRadius14,
    padding: SeedsConstants.margin14,
    alignItems: "center",
    shadowColor: tokens.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  startBtnText: { fontSize: SeedsConstants.fontSize15, fontWeight: "800", color: tokens.bg0 },
});
