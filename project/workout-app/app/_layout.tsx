import { Tabs } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";
import { tokens } from "../theme/tokens";

export default function TabsLayout() {
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
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Path
                d="M3 9L11 3L19 9V19H14V14H8V19H3V9Z"
                stroke={color}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <Circle cx={11} cy={11} r={8} stroke={color} strokeWidth={1.8} />
              <Path
                d="M11 7V11L14 13"
                stroke={color}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          ),
        }}
      />
    </Tabs>
  );
}
