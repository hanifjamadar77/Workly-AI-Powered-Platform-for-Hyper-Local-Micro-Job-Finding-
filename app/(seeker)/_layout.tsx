import { Slot, Tabs } from "expo-router";
import React from "react";

import { images } from "@/constants";
import { TabBarIconProps } from "@/type";
import { Image, View } from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? "#FE8C00" : "#5D5F6D"}
    />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          color: "#5D5F6D",
        },
        tabBarStyle: {
          marginHorizontal: 0,
          height: 70,
          position: "absolute",
          bottom: 0,
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
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
        options={({ navigation, route }) => ({
          title: "Post Jobs",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Post" icon={images.post} focused={focused} />
          ),
          // Hide tab bar on this screen
          tabBarStyle: { display: "none" },
        })}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="notifications" icon={images.notification} focused={focused} />
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
