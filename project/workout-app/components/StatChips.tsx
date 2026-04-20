import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Label } from "./Label";

interface StatChip {
  label: string;
  value: string;
  color: string;
}

interface StatChipsProps {
  chips?: StatChip[];
  sectionLabel?: string;
}

export function StatChips({
  chips,
  sectionLabel = "This month",
}: StatChipsProps) {
  const defaultChips: StatChip[] = [
    { label: "Workouts", value: "24", color: tokens.lime },
    { label: "Total Sets", value: "342", color: tokens.orange },
    { label: "Avg Time", value: "52m", color: tokens.violet },
    { label: "Volume", value: "52k kg", color: tokens.cyan },
    { label: "Streak", value: "12d", color: tokens.lime },
  ];
  const data = chips ?? defaultChips;

  return (
    <View style={{ marginTop: SeedsConstants.margin14 }}>
      <Text style={styles.sectionLabel}>{sectionLabel}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {data.map((chip, i) => (
          <View key={i} style={styles.chip}>
            <Text style={[styles.value, { color: chip.color }]}>
              {chip.value}
            </Text>
            <Label style={{ marginTop: SeedsConstants.margin6, fontSize: SeedsConstants.fontSize10 }}>
              {chip.label}
            </Label>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: SeedsConstants.fontSize13,
    fontWeight: "700",
    color: tokens.muted2,
    paddingHorizontal: SeedsConstants.margin20,
    marginBottom: SeedsConstants.margin10,
  },
  scroll: {
    paddingHorizontal: SeedsConstants.margin20,
    gap: SeedsConstants.margin10,
  },
  chip: {
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    borderRadius: SeedsConstants.borderRadius16,
    padding: SeedsConstants.margin14,
    minWidth: SeedsConstants.chipMinWidth,
  },
  value: {
    fontSize: SeedsConstants.fontSize26,
    fontWeight: "800",
    letterSpacing: SeedsConstants.letterSpacingMid,
    lineHeight: SeedsConstants.lineHeight28,
  },
});
