import { Tabs } from "expo-router";
import { ChartIcon, GearIcon, HomeIcon } from "../../lib/design/icons";
import { colors, fontFamily, strokeWidth } from "../../lib/design/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: "#9A9A9A",
        tabBarLabelStyle: { fontFamily: fontFamily.heading, fontSize: 12 },
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopWidth: strokeWidth.thick,
          borderTopColor: colors.ink,
          height: 66,
          paddingTop: 8,
          paddingBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => <ChartIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <GearIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
