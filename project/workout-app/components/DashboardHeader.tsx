import { SeedsConstants } from "@/constants/SeedsConstants";
import { tokens } from "@/theme/tokens";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Label } from "./Label";

interface HeaderProps {
  userName: string;
  accent?: string;
  date?: string;
  onAvatarPress?: () => void;
}

export function DashboardHeader({
  userName,
  accent = tokens.lime,
  date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }),
  onAvatarPress,
}: HeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View>
        <Label>{date}</Label>
        <Text style={styles.greeting}>{t("dashboard.morning")}, {userName}</Text>
      </View>
      <TouchableOpacity
        onPress={onAvatarPress}
        style={[styles.avatar, { backgroundColor: accent + "33", borderColor: accent }]}
        accessibilityRole="button"
        accessibilityLabel="Go to profile"
      >
        <Text style={[styles.avatarText, { color: accent }]}>{userName[0]}</Text>
      </TouchableOpacity>
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
