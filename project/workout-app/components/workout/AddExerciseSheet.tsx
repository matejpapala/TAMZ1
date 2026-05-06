import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { ExerciseDefinition } from "@/types/workout";
import { EXERCISES, EXERCISE_CATEGORIES } from "@/constants/exercises";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";

interface AddExerciseSheetProps {
  onAdd: (def: ExerciseDefinition) => void;
  onClose: () => void;
  accent?: string;
}

export function AddExerciseSheet({ onAdd, onClose, accent = tokens.lime }: AddExerciseSheetProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return EXERCISES;
    return EXERCISES.filter(
      (e) => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{t("history.addExercise")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <Path d="M2 2L10 10M10 2L2 10" stroke={tokens.muted2} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder={t("workout.searchExercises")}
            placeholderTextColor={tokens.muted}
            accessibilityLabel={t("workout.searchExercises")}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onAdd(item)} style={styles.item} accessibilityRole="button" accessibilityLabel={item.name}>
              <View style={[styles.itemIcon, { backgroundColor: item.color + "22", borderColor: item.color + "44" }]}>
                <Text style={styles.itemEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMuscle}>{item.muscle}</Text>
              </View>
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Circle cx={9} cy={9} r={8} stroke={accent} strokeWidth={1.5} />
                <Path d="M9 5V13M5 9H13" stroke={accent} strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: "flex-end" },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  sheet: {
    backgroundColor: tokens.bg1,
    borderTopLeftRadius: SeedsConstants.borderRadius28,
    borderTopRightRadius: SeedsConstants.borderRadius28,
    maxHeight: "82%",
    borderTopWidth: SeedsConstants.borderWidth1,
    borderTopColor: tokens.border2,
  },
  handle: { width: 38, height: 5, borderRadius: 3, backgroundColor: tokens.bg4, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SeedsConstants.margin20, paddingBottom: SeedsConstants.margin12 },
  sheetTitle: { fontSize: SeedsConstants.fontSize20, fontWeight: "800", letterSpacing: SeedsConstants.letterSpacingSnug, color: tokens.text },
  closeBtn: { width: 32, height: 32, backgroundColor: tokens.bg3, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  searchWrap: { paddingHorizontal: SeedsConstants.margin20, paddingBottom: SeedsConstants.margin12 },
  searchInput: {
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    borderRadius: SeedsConstants.borderRadius14,
    paddingHorizontal: SeedsConstants.margin16,
    paddingVertical: SeedsConstants.margin12,
    color: tokens.text,
    fontSize: SeedsConstants.fontSize14,
  },
  list: { paddingHorizontal: SeedsConstants.margin20, paddingBottom: SeedsConstants.margin24 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin12,
    paddingVertical: SeedsConstants.margin12,
    borderBottomWidth: SeedsConstants.borderWidth1,
    borderBottomColor: tokens.border,
  },
  itemIcon: { width: 38, height: 38, borderRadius: 11, borderWidth: SeedsConstants.borderWidth1, alignItems: "center", justifyContent: "center" },
  itemEmoji: { fontSize: 16 },
  itemText: { flex: 1 },
  itemName: { fontSize: SeedsConstants.fontSize15, fontWeight: "700", color: tokens.text },
  itemMuscle: { fontSize: SeedsConstants.fontSize12, color: tokens.muted, marginTop: 2 },
});
