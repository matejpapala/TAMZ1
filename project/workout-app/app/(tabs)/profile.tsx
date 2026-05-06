import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useUserStore } from "@/store/userStore";
import { useHistoryStore } from "@/store/historyStore";
import { WeightUnit } from "@/types/workout";
import { Label } from "@/components/Label";

function displayVolume(weightKg: number, unit: WeightUnit): string {
  const v = unit === "lbs" ? weightKg * 2.2046 : weightKg;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k ${unit}`;
  return `${Math.round(v)} ${unit}`;
}

function computeStats(workouts: ReturnType<typeof useHistoryStore.getState>["workouts"], unit: WeightUnit) {
  const totalWorkouts = workouts.length;
  let totalSets = 0;
  let totalVolumeKg = 0;
  const exerciseCount: Record<string, number> = {};

  for (const w of workouts) {
    for (const ex of w.exercises) {
      exerciseCount[ex.name] = (exerciseCount[ex.name] ?? 0) + 1;
      for (const s of ex.sets) {
        if (s.done) {
          totalSets++;
          totalVolumeKg += (Number(s.weight) || 0) * (Number(s.reps) || 0);
        }
      }
    }
  }

  const mostFrequent = Object.entries(exerciseCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  return {
    totalWorkouts,
    totalSets,
    totalVolume: displayVolume(totalVolumeKg, unit),
    mostFrequent,
  };
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { name, unit, setName, setUnit } = useUserStore();
  const workouts = useHistoryStore((s) => s.workouts);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const stats = computeStats(workouts, unit);
  const initial = (name || "?")[0].toUpperCase();

  const handleSaveName = () => {
    setName(nameInput.trim() || "You");
    setEditingName(false);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SeedsConstants.margin64 }}>
        <Text style={styles.screenTitle}>{t("tabs.profile")}</Text>

        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {editingName ? (
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  onBlur={handleSaveName}
                  onSubmitEditing={handleSaveName}
                  autoFocus
                  returnKeyType="done"
                  accessibilityLabel={t("profile.editName")}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => { setNameInput(name || ""); setEditingName(true); }}
                  accessibilityRole="button"
                  accessibilityLabel={t("profile.editName")}
                >
                  <Text style={styles.nameText}>{name || t("profile.tapToSetName")}</Text>
                  <Text style={styles.nameHint}>{t("profile.tapToEdit")}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <Label style={styles.sectionLabel}>{t("profile.units")}</Label>
        <View style={styles.card}>
          <View style={styles.unitRow}>
            {(["kg", "lbs"] as WeightUnit[]).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                style={[styles.unitPill, unit === u && styles.unitPillActive]}
                accessibilityRole="button"
                accessibilityLabel={`${t("profile.unit")} ${u}`}
              >
                <Text style={[styles.unitLabel, unit === u && styles.unitLabelActive]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Label style={styles.sectionLabel}>{t("profile.stats")}</Label>
        {workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{t("profile.emptyTitle")}</Text>
            <Text style={styles.emptyBody}>{t("profile.emptyBody")}</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <StatCard label={t("profile.totalWorkouts")} value={String(stats.totalWorkouts)} color={tokens.lime} />
            <StatCard label={t("profile.totalSets")} value={String(stats.totalSets)} color={tokens.orange} />
            <StatCard label={t("profile.totalVolume")} value={stats.totalVolume} color={tokens.cyan} />
            <StatCard label={t("profile.topExercise")} value={stats.mostFrequent} color={tokens.violet} small />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, color, small = false }: { label: string; value: string; color: string; small?: boolean }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }, small && styles.statValueSmall]} numberOfLines={2}>{value}</Text>
      <Label style={{ marginTop: SeedsConstants.margin6, fontSize: SeedsConstants.fontSize10 }}>{label}</Label>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: tokens.bg0 },
  screenTitle: {
    fontSize: SeedsConstants.fontSize24,
    fontWeight: "800",
    color: tokens.text,
    marginHorizontal: SeedsConstants.margin20,
    marginTop: SeedsConstants.margin20,
    marginBottom: SeedsConstants.margin14,
    letterSpacing: SeedsConstants.letterSpacingSnug,
  },
  card: {
    marginHorizontal: SeedsConstants.margin20,
    marginBottom: SeedsConstants.margin12,
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius20,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    padding: SeedsConstants.margin20,
  },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: SeedsConstants.margin16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: tokens.lime + "33",
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.lime + "66",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: SeedsConstants.fontSize24, fontWeight: "800", color: tokens.lime },
  nameText: { fontSize: 20, fontWeight: "800", color: tokens.text, letterSpacing: SeedsConstants.letterSpacingSnug },
  nameHint: { fontSize: SeedsConstants.fontSize11, color: tokens.muted, marginTop: 2 },
  nameInput: {
    fontSize: 20,
    fontWeight: "800",
    color: tokens.text,
    borderBottomWidth: 1,
    borderBottomColor: tokens.lime,
    paddingVertical: SeedsConstants.margin4,
  },
  sectionLabel: {
    marginHorizontal: SeedsConstants.margin20,
    marginBottom: SeedsConstants.margin10,
    marginTop: SeedsConstants.margin4,
  },
  unitRow: { flexDirection: "row", gap: SeedsConstants.margin10 },
  unitPill: {
    flex: 1,
    paddingVertical: SeedsConstants.margin12,
    borderRadius: SeedsConstants.borderRadius12,
    backgroundColor: tokens.bg3,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    alignItems: "center",
  },
  unitPillActive: { backgroundColor: tokens.lime + "22", borderColor: tokens.lime },
  unitLabel: { fontSize: SeedsConstants.fontSize15, fontWeight: "700", color: tokens.muted2 },
  unitLabelActive: { color: tokens.lime },
  statsGrid: {
    marginHorizontal: SeedsConstants.margin20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SeedsConstants.margin10,
  },
  statCard: {
    width: "47%",
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius16,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    padding: SeedsConstants.margin14,
  },
  statValue: {
    fontSize: SeedsConstants.fontSize26,
    fontWeight: "800",
    letterSpacing: SeedsConstants.letterSpacingMid,
    lineHeight: SeedsConstants.lineHeight28,
  },
  statValueSmall: { fontSize: SeedsConstants.fontSize15, lineHeight: 22 },
  emptyState: {
    marginHorizontal: SeedsConstants.margin20,
    padding: SeedsConstants.margin28,
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius20,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    alignItems: "center",
  },
  emptyTitle: { fontSize: SeedsConstants.fontSize16, fontWeight: "800", color: tokens.text, marginBottom: SeedsConstants.margin8 },
  emptyBody: { fontSize: SeedsConstants.fontSize13, color: tokens.muted2, textAlign: "center", lineHeight: 20 },
});
