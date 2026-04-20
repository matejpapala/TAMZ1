import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { StyleSheet, Text, View } from "react-native";
import { Label } from "./Label";

interface HeaderProps {
  userName: string;
  accent?: string;
  date?: string;
}

export function DashboardHeader({
  userName,
  accent = tokens.lime,
  date = "Sunday, Apr 20",
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Label>{date}</Label>
        <Text style={styles.greeting}>Morning, {userName} 👊</Text>
      </View>
      <View
        style={[
          styles.avatar,
          { backgroundColor: accent + "33", borderColor: accent },
        ]}
      >
        <Text style={[styles.avatarText, { color: accent }]}>
          {userName[0]}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SeedsConstants.margin20,
    paddingTop: SeedsConstants.margin16,
  },
  greeting: {
    fontSize: SeedsConstants.fontSize24,
    fontWeight: "800",
    color: tokens.text,
    marginTop: SeedsConstants.margin4,
    letterSpacing: SeedsConstants.letterSpacingSnug,
  },
  avatar: {
    width: SeedsConstants.avatarSize40,
    height: SeedsConstants.avatarSize40,
    borderRadius: SeedsConstants.avatarSize40 / 2,
    borderWidth: SeedsConstants.borderWidth2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: SeedsConstants.fontSize15,
    fontWeight: "800",
  },
});
