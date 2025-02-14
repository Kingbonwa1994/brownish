"use client";

import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, Platform, SafeAreaView } from "react-native";
import { MaterialCommunityIcons, Feather, Ionicons, FontAwesome6 } from "@expo/vector-icons";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useGlobalContext } from '@/lib/global-provider'

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { loading, isLogged } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  if (!isLogged) {
    return <Redirect href="/sign-in" />;
  }

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
            <MaterialCommunityIcons name="home-variant" size={28} color={color} />
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