import { Tabs } from "expo-router";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { tokens } from "@/theme/tokens";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tokens.bg1,
          borderTopColor: tokens.border,
        },
        tabBarActiveTintColor: tokens.lime,
        tabBarInactiveTintColor: "rgba(240,240,243,0.35)",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => (
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Path d="M3 9L11 3L19 9V19H14V14H8V19H3V9Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t("tabs.history"),
          tabBarIcon: ({ color }) => (
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={1.8} />
              <Path d="M11 7V11L14 13" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color }) => (
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Circle cx={11} cy={8} r={3.5} stroke={color} strokeWidth={1.8} />
              <Path d="M4 19C4 15.686 7.134 13 11 13C14.866 13 18 15.686 18 19" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          ),
        }}
      />
    </Tabs>
  );
}
