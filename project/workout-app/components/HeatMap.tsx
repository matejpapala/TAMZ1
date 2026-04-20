import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";

interface HeatMapProps {
  weeks?: number;
  accent?: string;
}

export function HeatMap({ weeks = 14, accent = tokens.lime }: HeatMapProps) {
  const cells = useMemo(
    () =>
      Array.from({ length: weeks * 7 }, () => {
        const r = Math.random();
        return { v: r > 0.55 ? Math.ceil(r * 3) : 0 };
      }),
    [weeks],
  );
  const alpha = [0, 0.2, 0.5, 1];

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
