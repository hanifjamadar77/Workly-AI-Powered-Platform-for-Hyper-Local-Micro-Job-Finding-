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

  // const router = useRouter();
  // const isAuthenticated = false;

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace("/(auth)/login");
  //   }
  // }, [isAuthenticated]);

  // if (!isAuthenticated) return null;
   

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 10, // label text size
          fontWeight: "600",
          color : "#5D5F6D",
        },
        tabBarStyle: {
          // borderTopLeftRadius: 50,
          // borderTopRightRadius: 50,
          // borderBottomLeftRadius: 50,
          // borderBottomRightRadius: 50,
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
        options={{
          title: "Post Jobs",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon title="Post" icon={images.post} focused={focused} />
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

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              title="Profile"
              icon={images.profile}
              focused={focused}
            />
          ),
        }}
      />
      <Slot />
    </Tabs>
  );
}
