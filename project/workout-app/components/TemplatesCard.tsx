import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

interface TemplatesCardProps {
  routineCount?: number;
  onPress?: () => void;
}

export function TemplatesCard({
  routineCount = 5,
  onPress,
}: TemplatesCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <View style={styles.icon}>
        <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
          <Rect
            x={2.5}
            y={3}
            width={15}
            height={14}
            rx={3}
            stroke={tokens.violet}
            strokeWidth={1.6}
          />
          <Path
            d="M6 8H14M6 11.5H11"
            stroke={tokens.violet}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>My Templates</Text>
        <Text style={styles.sub}>
          {routineCount} routines saved · Tap to edit
        </Text>
      </View>
      <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
        <Path
          d="M1 1l6 6-6 6"
          stroke={tokens.muted}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    </TouchableOpacity>
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
    padding: SeedsConstants.margin14,
    flexDirection: "row",
    alignItems: "center",
    gap: SeedsConstants.margin14,
  },
  icon: {
    width: SeedsConstants.iconSize40,
    height: SeedsConstants.iconSize40,
    borderRadius: SeedsConstants.borderRadius12,
    backgroundColor: tokens.violet + "22",
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.violet + "44",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: SeedsConstants.fontSize15,
    fontWeight: "700",
    color: tokens.text,
  },
  sub: {
    fontSize: SeedsConstants.fontSize12,
    color: tokens.muted,
    marginTop: SeedsConstants.margin2,
  },
});
