import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { StyleSheet, View } from "react-native";
import { HeatMap } from "./HeatMap";
import { Label } from "./Label";
import { useTranslation } from "react-i18next";

interface ActivityCardProps {
  weeks?: number;
  accent?: string;
  workoutDates?: number[];
}

export function ActivityCard({ weeks = 14, accent = tokens.lime, workoutDates = [] }: ActivityCardProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Label>{t("home.activity", { count: weeks })}</Label>
      </View>
      <HeatMap weeks={weeks} accent={accent} workoutDates={workoutDates} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SeedsConstants.margin20,
    marginTop: SeedsConstants.margin14,
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border,
    borderRadius: SeedsConstants.borderRadius20,
    padding: SeedsConstants.margin16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SeedsConstants.margin12,
  },
});
