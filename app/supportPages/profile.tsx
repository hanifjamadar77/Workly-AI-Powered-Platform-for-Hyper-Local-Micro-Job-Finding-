import ProfileMenuItem from "@/components/profileMenuItem";
import { getCurrentUser } from "@/lib/appwrite";
import { useNavigation } from "@react-navigation/native";
import { images } from "@/constants";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function MainProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleEditProfile = () => {
    // navigation.navigate('YourProfile');
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Profile Header with Background Banner */}
        <View className="relative">
          <View className="flex-row items-center justify-between px-5 py-6 bg-transparent">
            <TouchableOpacity onPress={() => router.replace("/(seeker)")}>
              <Image
                source={images.arrowBack}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Background Rectangle Banner */}
          {/* <View
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 rounded-b-3xl"
            style={{ backgroundColor: "#6366f1" }}
          /> */}

          {/* Profile Content Overlay */}
          <View className="absolute -bottom-16 left-0 right-0 items-center">
            {/* Profile Avatar with Edit Button */}
            <View className="relative">
              <View className="w-28 h-28  rounded-full justify-center items-center border-4 border-white shadow-lg">
                <Image
                  source={{ uri: user.avatar }}
                  className="w-24 h-24 rounded-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full justify-center items-center border-2 border-white"
                onPress={handleEditProfile}
              >
                <Text className="text-white text-sm">✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Name Section */}
        <View className="items-center mt-20 mb-4">
          <Text className="text-xl font-bold text-indigo-600">{user.name}</Text>
        </View>

        {/* Menu Items */}
        <View className="px-4">
          <ProfileMenuItem
            icon="👤"
            title="Your Profile"
            screenName="profileScreens/yourProfile"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="👤"
            title="Posted Jobs"
            screenName="profileScreens/postedJobs"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="💳"
            title="Payment Method"
            screenName="profileScreens/payment"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="⚙️"
            title="Settings"
            screenName="profileScreens/settings"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="❓"
            title="Help Center"
            screenName="profileScreens/help"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="🛡️"
            title="Privacy Policy"
            screenName="profileScreens/policy"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="👥"
            title="Invites Friends"
            screenName="profileScreens/invite"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
          <ProfileMenuItem
            icon="🚪"
            title="Log Out"
            screenName="Logout"
            iconColor="text-gray-800"
            textColor="text-indigo-600"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
