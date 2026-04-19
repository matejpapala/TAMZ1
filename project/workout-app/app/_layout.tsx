import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function RootLayout() {
  const { t } = useTranslation();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#6366f1" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.workout"),
          tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t("tabs.history"),
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-clear-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
