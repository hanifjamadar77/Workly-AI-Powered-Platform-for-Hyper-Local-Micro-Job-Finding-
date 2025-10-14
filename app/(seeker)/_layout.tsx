import { Slot, Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import { useTheme } from "@/lib/ThemeContext";
import { images } from "@/constants";
import { TabBarIconProps } from "@/type";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => {
  const { isDarkMode } = useTheme();
  return (
    <View className="items-center justify-center">
      <Image
        source={icon}
        className="w-7 h-7"
        resizeMode="contain"
        style={{
          tintColor: focused
            ? isDarkMode
              ? "#FE8C00"
              : "#FE8C00"
            : isDarkMode
            ? "#A0A0A0"
            : "#5D5F6D",
        }}
      />
    </View>
  );
};

export default function TabLayout() {
  const { colors, isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          color: isDarkMode ? "#E5E5E5" : "#5D5F6D",
        },
        tabBarStyle: {
          marginHorizontal: 0,
          height: 70,
          position: "absolute",
          bottom: 0,
          backgroundColor: isDarkMode ? "#1F1F1F" : "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Home" icon={images.home} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Search" icon={images.jobs} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          title: "Post Jobs",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Post" icon={images.post} focused={focused} />
          ),
          tabBarStyle: { display: "none" }, // Hide tab bar on post screen
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="notifications"
              icon={images.notification}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="jobProfile"
        options={{
          title: "Job Profiles",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Job Profile"
              icon={images.jobProfile}
              focused={focused}
            />
          ),
        }}
      />

      <Slot />
    </Tabs>
  );
}
