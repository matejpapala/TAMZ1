import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

interface HeatMapProps {
  weeks?: number;
  accent?: string;
  workoutDates?: number[];
}

export function HeatMap({ weeks = 14, accent = tokens.lime, workoutDates = [] }: HeatMapProps) {
  const cells = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const ts of workoutDates) {
      const key = new Date(ts).toDateString();
      countMap.set(key, (countMap.get(key) ?? 0) + 1);
    }

    const now = new Date();
    const total = weeks * 7;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (total - 1 - i));
      const count = countMap.get(d.toDateString()) ?? 0;
      return { v: Math.min(count, 3) };
    });
  }, [weeks, workoutDates]);

  const alpha = [0, 0.25, 0.6, 1];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: "row", gap: SeedsConstants.margin4 }}>
        {Array.from({ length: weeks }, (_, w) => (
          <View key={w} style={{ flexDirection: "column", gap: SeedsConstants.margin4 }}>
            {Array.from({ length: 7 }, (_, d) => {
              const cell = cells[w * 7 + d];
              return (
                <View
                  key={d}
                  style={{
                    width: SeedsConstants.cellSize12,
                    height: SeedsConstants.cellSize12,
                    borderRadius: SeedsConstants.borderRadius4,
                    backgroundColor: cell.v === 0 ? tokens.bg3 : accent,
                    opacity: cell.v === 0 ? 1 : alpha[cell.v],
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
