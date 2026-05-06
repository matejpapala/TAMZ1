import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { WorkoutSet } from "@/types/workout";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  onChange: (updated: WorkoutSet) => void;
  onToggle: () => void;
}

const RPE_VALUES = [6, 7, 8, 9, 10];

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
  const [rpeOpen, setRpeOpen] = useState(false);
  const rpe = set.rpe ?? 8;

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
          returnKeyType="done"
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
          returnKeyType="done"
          accessibilityLabel={`Set ${index + 1} reps`}
        />
        <Text style={styles.inputUnit}>REPS</Text>
      </View>

      <View style={styles.rpeWrap}>
        <TouchableOpacity
          onPress={() => setRpeOpen(true)}
          style={styles.rpeBtn}
          accessibilityRole="button"
          accessibilityLabel={`RPE: ${rpe}`}
        >
          <Text style={styles.rpeBtnText}>{rpe}</Text>
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

      {rpeOpen && (
        <Modal transparent animationType="fade" onRequestClose={() => setRpeOpen(false)}>
          <TouchableOpacity style={styles.rpeOverlay} activeOpacity={1} onPress={() => setRpeOpen(false)}>
            <View style={styles.rpeDropdown}>
              <Text style={styles.rpeDropdownTitle}>RPE</Text>
              {RPE_VALUES.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.rpeOption, v === rpe && styles.rpeOptionActive]}
                  onPress={() => { onChange({ ...set, rpe: v }); setRpeOpen(false); }}
                  accessibilityRole="button"
                  accessibilityLabel={`RPE ${v}`}
                >
                  <Text style={[styles.rpeOptionText, v === rpe && { color: tokens.lime }]}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
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
  rpeBtn: {
    width: 28,
    height: 28,
    borderRadius: SeedsConstants.borderRadius8,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    backgroundColor: tokens.bg3,
    alignItems: "center",
    justifyContent: "center",
  },
  rpeBtnText: { fontSize: SeedsConstants.fontSize11, fontWeight: "800", color: tokens.text },
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
  rpeOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  rpeDropdown: {
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius16,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    paddingVertical: SeedsConstants.margin8,
    minWidth: 120,
    overflow: "hidden",
  },
  rpeDropdownTitle: {
    fontSize: SeedsConstants.fontSize9,
    fontWeight: "700",
    color: tokens.muted,
    letterSpacing: 0.8,
    textAlign: "center",
    paddingVertical: SeedsConstants.margin8,
    borderBottomWidth: SeedsConstants.borderWidth1,
    borderBottomColor: tokens.border,
    marginBottom: SeedsConstants.margin4,
  },
  rpeOption: {
    paddingVertical: SeedsConstants.margin12,
    paddingHorizontal: SeedsConstants.margin20,
    alignItems: "center",
  },
  rpeOptionActive: {
    backgroundColor: tokens.lime + "18",
  },
  rpeOptionText: {
    fontSize: SeedsConstants.fontSize18,
    fontWeight: "800",
    color: tokens.text,
  },
});
