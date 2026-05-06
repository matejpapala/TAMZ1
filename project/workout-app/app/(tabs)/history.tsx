import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { tokens } from "@/theme/tokens";
import { SeedsConstants } from "@/constants/SeedsConstants";
import { useHistoryStore } from "@/store/historyStore";
import { WorkoutCard } from "@/components/history/WorkoutCard";
import Svg, { Path, Rect } from "react-native-svg";

function EmptyHistory() {
  const { t } = useTranslation();
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
          <Rect x={6} y={6} width={24} height={24} rx={4} stroke={tokens.muted2} strokeWidth={1.6} />
          <Path d="M12 13H24M12 18H20M12 23H16" stroke={tokens.muted} strokeWidth={1.6} strokeLinecap="round" />
        </Svg>
      </View>
      <Text style={styles.emptyTitle}>{t("history.emptyTitle")}</Text>
      <Text style={styles.emptyBody}>{t("history.emptyBody")}</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const workouts = useHistoryStore((s) => s.workouts);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <Text style={styles.screenTitle}>{t("history.title")}</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutCard workout={item} onPress={() => router.push(`/workout/${item.id}`)} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: SeedsConstants.margin10 }} />}
        contentContainerStyle={workouts.length === 0 ? { flex: 1 } : { paddingBottom: SeedsConstants.margin32 }}
        ListEmptyComponent={<EmptyHistory />}
        showsVerticalScrollIndicator={false}
        onRefresh={() => useHistoryStore.getState().loadWorkouts()}
        refreshing={false}
      />
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
  empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: SeedsConstants.margin32 },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SeedsConstants.margin20,
    borderStyle: "dashed",
  },
  emptyTitle: { fontSize: SeedsConstants.fontSize18, fontWeight: "800", color: tokens.text, marginBottom: SeedsConstants.margin8 },
  emptyBody: { fontSize: SeedsConstants.fontSize13, color: tokens.muted2, textAlign: "center", lineHeight: 20 },
});
