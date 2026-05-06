import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { WorkoutSet, IntensityLevel } from "@/types/workout";
import { useUserStore } from "@/store/userStore";

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  onChange: (updated: WorkoutSet) => void;
  onToggle: () => void;
}

const INTENSITY_LEVELS: { key: IntensityLevel; label: string; short: string; color: string }[] = [
  { key: "warmup",  label: "Warmup", short: "W", color: tokens.cyan },
  { key: "easy",    label: "Easy",   short: "E", color: "#84cc16" },
  { key: "working", label: "Working",short: "M", color: tokens.lime },
  { key: "hard",    label: "Hard",   short: "H", color: tokens.orange },
  { key: "failure", label: "Failure",short: "F", color: tokens.red },
];

export { INTENSITY_LEVELS };

interface SetHeaderProps { }

export function SetTableHeader(_: SetHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <Text style={[styles.colLabel, { width: 28 }]}>SET</Text>
      <Text style={[styles.colLabel, { flex: 1, textAlign: "center" }]}>WEIGHT</Text>
      <Text style={[styles.colLabel, { flex: 1, textAlign: "center" }]}>REPS</Text>
      <Text style={[styles.colLabel, { width: 28, textAlign: "center" }]}>RPE</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

export function SetRow({ set, index, onChange, onToggle }: SetRowProps) {
  const unit = useUserStore((s) => s.unit);
  const intensity = INTENSITY_LEVELS.find((l) => l.key === set.intensity) ?? INTENSITY_LEVELS[2];

  const cycleIntensity = () => {
    const idx = INTENSITY_LEVELS.findIndex((l) => l.key === set.intensity);
    const next = INTENSITY_LEVELS[(idx + 1) % INTENSITY_LEVELS.length];
    onChange({ ...set, intensity: next.key });
  };

  return (
    <View style={styles.row}>
      <View style={styles.setNum}>
        <Text style={styles.setNumText}>{index + 1}</Text>
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={set.weight}
          onChangeText={(v) => onChange({ ...set, weight: v })}
          placeholder="0"
          placeholderTextColor={tokens.muted}
          keyboardType="decimal-pad"
          accessibilityLabel={`Set ${index + 1} weight`}
        />
        <Text style={styles.inputUnit}>{unit.toUpperCase()}</Text>
      </View>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          value={set.reps}
          onChangeText={(v) => onChange({ ...set, reps: v })}
          placeholder="0"
          placeholderTextColor={tokens.muted}
          keyboardType="number-pad"
          accessibilityLabel={`Set ${index + 1} reps`}
        />
        <Text style={styles.inputUnit}>REPS</Text>
      </View>

      <View style={styles.rpeWrap}>
        <TouchableOpacity
          onPress={cycleIntensity}
          style={[styles.rpeBtn, { backgroundColor: intensity.color + "22", borderColor: intensity.color + "55" }]}
          accessibilityRole="button"
          accessibilityLabel={`Intensity: ${intensity.label}`}
        >
          <Text style={[styles.rpeBtnText, { color: intensity.color }]}>{intensity.short}</Text>
        </TouchableOpacity>
        <Text style={styles.inputUnit}>RPE</Text>
      </View>

      <TouchableOpacity
        onPress={onToggle}
        style={[styles.doneBtn, set.done && { backgroundColor: tokens.lime, borderColor: tokens.lime }]}
        accessibilityRole="checkbox"
        accessibilityLabel={`Set ${index + 1} done`}
        accessibilityState={{ checked: set.done }}
      >
        {set.done && (
          <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path d="M3 8L7 12L13 4" stroke={tokens.bg0} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", gap: SeedsConstants.margin8, paddingVertical: SeedsConstants.margin10 },
  colLabel: { fontSize: SeedsConstants.fontSize9, color: tokens.muted, fontWeight: "700", letterSpacing: 0.6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin8,
    paddingVertical: SeedsConstants.margin8,
    borderBottomWidth: SeedsConstants.borderWidth1,
    borderBottomColor: tokens.border,
  },
  setNum: { width: 28, height: 28, borderRadius: SeedsConstants.borderRadius8, backgroundColor: tokens.bg3, alignItems: "center", justifyContent: "center" },
  setNumText: { fontSize: SeedsConstants.fontSize12, fontWeight: "800", color: tokens.muted2 },
  inputWrap: { flex: 1, alignItems: "center" },
  input: {
    backgroundColor: tokens.bg3,
    borderRadius: SeedsConstants.borderRadius8,
    paddingVertical: SeedsConstants.margin8,
    paddingHorizontal: SeedsConstants.margin8,
    fontSize: SeedsConstants.fontSize14,
    fontWeight: "700",
    color: tokens.text,
    textAlign: "center",
    width: "100%",
  },
  inputUnit: { fontSize: SeedsConstants.fontSize9, color: tokens.muted, textAlign: "center", marginTop: 2, fontWeight: "600", letterSpacing: 0.5 },
  rpeWrap: { width: 28, alignItems: "center" },
  rpeBtn: { width: 28, height: 28, borderRadius: SeedsConstants.borderRadius8, borderWidth: SeedsConstants.borderWidth1, alignItems: "center", justifyContent: "center" },
  rpeBtnText: { fontSize: SeedsConstants.fontSize11, fontWeight: "800" },
  doneBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: tokens.bg3,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    alignItems: "center",
    justifyContent: "center",
  },
});
