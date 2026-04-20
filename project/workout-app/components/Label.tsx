import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { StyleSheet, Text } from "react-native";

interface LabelProps {
  children: React.ReactNode;
  style?: object;
}

export function Label({ children, style }: LabelProps) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: SeedsConstants.fontSize11,
    fontWeight: "600",
    letterSpacing: SeedsConstants.letterSpacingLabel,
    textTransform: "uppercase",
    color: tokens.muted,
  },
});
