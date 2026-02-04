import { Tabs } from "expo-router";
import React from "react";
import { Home, Zap, MapPin, Users, User } from "lucide-react-native";
import { Platform } from "react-native";
import { useSession } from "@/src/core/auth/AuthProvider";
import { useTheme } from "@/src/core/theme/ThemeProvider";

function TabBarIcon({
  IconComponent,
  color,
}: {
  IconComponent: any;
  color: string;
}) {
  return <IconComponent size={20} color={color} strokeWidth={2.5} />;
}

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const isDark = (colorScheme as "light" | "dark" | undefined) === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1A4D2E", // Deep Forest
        tabBarInactiveTintColor: "#1A4D2E66", // Deep Forest with opacity
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: "SpaceMono",
          fontWeight: "bold",
          fontSize: 10,
          textTransform: "uppercase",
        },
        tabBarStyle: {
          backgroundColor: "#F9FDF5", // Bio-Cream
          borderTopColor: "#1A4D2E", // Deep Forest
          borderTopWidth: 2,
          borderLeftColor: "#1A4D2E",
          borderLeftWidth: 2,
          borderRightColor: "#1A4D2E",
          borderRightWidth: 2,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Home} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Zap} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={MapPin} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Users} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={User} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
