import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

interface StartCTAsProps {
  accent?: string;
  onStartBlank?: () => void;
  onStartTemplate?: () => void;
}

export function StartCTAs({
  accent = tokens.lime,
  onStartBlank,
  onStartTemplate,
}: StartCTAsProps) {
  return (
    <View style={styles.row}>
      {/* Blank workout */}
      <TouchableOpacity
        onPress={onStartBlank}
        activeOpacity={0.85}
        style={[
          styles.button,
          styles.primary,
          {
            backgroundColor: accent,
            shadowColor: accent,
          },
        ]}
      >
        <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <Circle cx={9} cy={9} r={7.5} stroke={tokens.bg0} strokeWidth={1.8} />
          <Path
            d="M9 5.5V12.5M5.5 9H12.5"
            stroke={tokens.bg0}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={[styles.primaryText, { color: tokens.bg0 }]}>
          Blank Workout
        </Text>
      </TouchableOpacity>

      {/* From template */}
      <TouchableOpacity
        onPress={onStartTemplate}
        activeOpacity={0.85}
        style={[styles.button, styles.secondary]}
      >
        <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <Rect
            x={2}
            y={3}
            width={14}
            height={12}
            rx={2.5}
            stroke={tokens.muted2}
            strokeWidth={1.6}
          />
          <Path
            d="M5 7H13M5 10H10"
            stroke={tokens.muted2}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.secondaryText}>From Template</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: SeedsConstants.margin10,
    marginHorizontal: SeedsConstants.margin20,
    marginTop: SeedsConstants.margin18,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SeedsConstants.margin8,
    borderRadius: SeedsConstants.borderRadius16,
    paddingVertical: SeedsConstants.margin14,
    paddingHorizontal: SeedsConstants.margin10,
  },
  primary: {
    shadowOffset: { width: 0, height: SeedsConstants.shadowOffsetY },
    shadowOpacity: 0.3,
    shadowRadius: SeedsConstants.shadowRadiusLg,
    elevation: SeedsConstants.shadowElevationLg,
  },
  secondary: {
    backgroundColor: tokens.bg2,
    borderWidth: SeedsConstants.borderWidth1,
    borderColor: tokens.border2,
  },
  primaryText: {
    fontSize: SeedsConstants.fontSize15,
    fontWeight: "800",
  },
  secondaryText: {
    fontSize: SeedsConstants.fontSize15,
    fontWeight: "700",
    color: tokens.text,
  },
});
