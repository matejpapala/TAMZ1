import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";

interface RestTimerSheetProps {
  onClose: () => void;
  accent?: string;
}

const PRESETS = [30, 60, 90, 120] as const;

function fmtTimer(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function RestTimerSheet({ onClose, accent = tokens.lime }: RestTimerSheetProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number>(60);
  const [remaining, setRemaining] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const running = remaining !== null;

  const start = (duration: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(duration);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r === null || r <= 1) {
          clearInterval(intervalRef.current!);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return null;
        }
        return r - 1;
      });
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(null);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const progress = remaining !== null ? remaining / selected : 0;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.title}>{t("workout.restTimerTitle")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
            <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <Path d="M2 2L10 10M10 2L2 10" stroke={tokens.muted2} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.display}>
          <Text style={[styles.countdown, { color: running ? accent : tokens.text }]}>
            {running ? fmtTimer(remaining!) : fmtTimer(selected)}
          </Text>
          {running && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` as `${number}%`, backgroundColor: accent }]} />
            </View>
          )}
        </View>

        <View style={styles.presets}>
          {PRESETS.map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => { setSelected(p); if (!running) {} }}
              style={[styles.preset, selected === p && !running && { backgroundColor: accent + "22", borderColor: accent }]}
              accessibilityRole="button"
              accessibilityLabel={`${p} seconds`}
            >
              <Text style={[styles.presetText, selected === p && !running && { color: accent }]}>{p}s</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          {running ? (
            <TouchableOpacity onPress={stop} style={styles.stopBtn} accessibilityRole="button" accessibilityLabel="Stop timer">
              <Text style={styles.stopText}>Stop</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => start(selected)}
              style={[styles.startBtn, { backgroundColor: accent, shadowColor: accent }]}
              accessibilityRole="button"
              accessibilityLabel="Start timer"
            >
              <Text style={styles.startText}>Start</Text>
            </TouchableOpacity>
          )}
        </View>
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
    borderTopWidth: SeedsConstants.borderWidth1,
    borderTopColor: tokens.border2,
    paddingBottom: SeedsConstants.margin32,
  },
  handle: { width: 38, height: 5, borderRadius: 3, backgroundColor: tokens.bg4, alignSelf: "center", marginTop: 10, marginBottom: 4 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: SeedsConstants.margin20, paddingBottom: SeedsConstants.margin12 },
  title: { fontSize: SeedsConstants.fontSize20, fontWeight: "800", color: tokens.text },
  closeBtn: { width: 32, height: 32, backgroundColor: tokens.bg3, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  display: { alignItems: "center", paddingVertical: SeedsConstants.margin24 },
  countdown: { fontSize: 64, fontWeight: "800", letterSpacing: -2 },
  progressBar: { height: 4, width: "70%", backgroundColor: tokens.bg3, borderRadius: 2, marginTop: SeedsConstants.margin14, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  presets: { flexDirection: "row", justifyContent: "center", gap: SeedsConstants.margin10, marginBottom: SeedsConstants.margin20 },
  preset: { paddingVertical: SeedsConstants.margin10, paddingHorizontal: SeedsConstants.margin18, borderRadius: SeedsConstants.borderRadius12, backgroundColor: tokens.bg3, borderWidth: SeedsConstants.borderWidth1, borderColor: tokens.border2 },
  presetText: { fontSize: SeedsConstants.fontSize14, fontWeight: "700", color: tokens.muted2 },
  actions: { paddingHorizontal: SeedsConstants.margin20 },
  startBtn: { borderRadius: SeedsConstants.borderRadius16, padding: SeedsConstants.margin14, alignItems: "center", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 },
  startText: { fontSize: SeedsConstants.fontSize15, fontWeight: "800", color: tokens.bg0 },
  stopBtn: { borderRadius: SeedsConstants.borderRadius16, padding: SeedsConstants.margin14, alignItems: "center", backgroundColor: tokens.bg3, borderWidth: SeedsConstants.borderWidth1, borderColor: tokens.border2 },
  stopText: { fontSize: SeedsConstants.fontSize15, fontWeight: "700", color: tokens.muted2 },
});
