import { Dimensions, Text, View } from "react-native";
import { SeedsConstants } from "../constants/SeedsConstants";
import { tokens } from "../theme/tokens";
import { BarData } from "../types/dashboard";

interface WeekBarsProps {
  data: BarData[];
  accent?: string;
  height?: number;
}

export function WeekBars({
  data,
  accent = tokens.lime,
  height = SeedsConstants.weekBarHeight,
}: WeekBarsProps) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const max = Math.max(...data.map((d) => d.value || 1));
  const barWidth =
    Math.floor((Dimensions.get("window").width - SeedsConstants.margin20 * 4) / 7) -
    SeedsConstants.margin6;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        gap: SeedsConstants.margin6,
        height: height + SeedsConstants.margin18,
      }}
    >
      {data.map((d, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            alignItems: "center",
            gap: SeedsConstants.margin4,
            height: "100%",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              width: "100%",
              height: d.value ? (d.value / max) * height : SeedsConstants.margin4,
              minHeight: SeedsConstants.margin4,
              borderRadius: SeedsConstants.borderRadius4,
              backgroundColor: d.isToday ? accent : tokens.bg3,
              opacity: d.value === 0 ? 0.25 : 1,
              shadowColor: d.isToday ? accent : "transparent",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: d.isToday ? 0.6 : 0,
              shadowRadius: SeedsConstants.shadowRadiusSm,
              elevation: d.isToday ? SeedsConstants.shadowElevationSm : 0,
            }}
          />
          <Text
            style={{
              fontSize: SeedsConstants.fontSize9,
              color: d.isToday ? tokens.text : tokens.muted,
              fontWeight: d.isToday ? "700" : "400",
            }}
          >
            {days[i]}
          </Text>
        </View>
      ))}
    </View>
  );
}
