import { StyleSheet, Text, View } from "react-native";
import { SeedsConstants } from "../constants/SeedsConstants";
import { tokens } from "../theme/tokens";

interface PillProps {
  label: string;
  color?: string;
}

export function Pill({ label, color = tokens.lime }: PillProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color + "20", borderColor: color + "30" },
      ]}
    >
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SeedsConstants.borderRadius8,
    borderWidth: SeedsConstants.borderWidth1,
    paddingHorizontal: SeedsConstants.margin8,
    paddingVertical: SeedsConstants.margin2,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: SeedsConstants.fontSize11,
    fontWeight: "700",
    letterSpacing: SeedsConstants.letterSpacingLoose,
    textTransform: "uppercase",
  },
});
