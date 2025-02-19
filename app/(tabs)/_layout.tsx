import {  Tabs } from "expo-router";
import React from "react";
import {  Platform } from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";




export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            borderTopWidth: 0,
          },
          default: {},
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />

      {/* Explore Tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Feather name="compass" size={28} color={color} />,
        }}
      />

      {/* Submit Tab */}
      <Tabs.Screen
        name="submit"
        options={{
          title: "Submit",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cloud-upload-outline" size={28} color={color} />
          ),
        }}
      />

      {/* Tickets Tab */}
      <Tabs.Screen
        name="tickets"
        options={{
          title: "Tickets",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={28} color={color} />
          ),
        }}
      />

      {/* Reels Tab */}
      <Tabs.Screen
        name="reels"
        options={{
          title: "Reels",
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome6 name="clapperboard" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}