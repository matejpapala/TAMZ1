import { StyleSheet, Text, View } from "react-native";
import { SeedsConstants } from "../constants/SeedsConstants";
import { tokens } from "../theme/tokens";
import { BarData } from "../types/dashboard";
import { Label } from "./Label";
import { WeekBars } from "./WeekBars";

interface HeroCardProps {
  accent?: string;
  weeklyData?: BarData[];
  workoutsCount?: number;
  workoutsGoal?: number;
}

export function HeroWeekCard({
  accent = tokens.lime,
  weeklyData = [],
  workoutsCount = 0,
  workoutsGoal = 5,
}: HeroCardProps) {
  return (
    <View style={[styles.card, { borderColor: tokens.border }]}>
      <Label>This week</Label>
      <View style={styles.row}>
        <Text style={styles.bigNumber}>{workoutsCount}</Text>
        <Text style={styles.of}>/ {workoutsGoal} workouts</Text>
      </View>
      <WeekBars data={weeklyData} accent={accent} height={SeedsConstants.weekBarHeight} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SeedsConstants.margin20,
    marginTop: SeedsConstants.margin14,
    backgroundColor: tokens.bg2,
    borderRadius: SeedsConstants.borderRadius20,
    padding: SeedsConstants.margin20,
    borderWidth: SeedsConstants.borderWidth1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: SeedsConstants.shadowOffsetY },
    shadowOpacity: 0.2,
    shadowRadius: SeedsConstants.shadowRadiusLg,
    elevation: SeedsConstants.shadowElevationSm,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SeedsConstants.margin8,
    marginTop: SeedsConstants.margin4,
    marginBottom: SeedsConstants.margin14,
  },
  bigNumber: {
    fontSize: SeedsConstants.fontSize56,
    fontWeight: "800",
    color: tokens.text,
    lineHeight: SeedsConstants.lineHeight60,
    letterSpacing: SeedsConstants.letterSpacingTight,
  },
  of: {
    fontSize: SeedsConstants.fontSize16,
    color: tokens.muted,
    marginBottom: SeedsConstants.margin8,
  },
});
