import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  your_profile: undefined;
  PaymentMethod: undefined;
  Settings: undefined;
  HelpCenter: undefined;
  PrivacyPolicy: undefined;
  InviteFriends: undefined;
  login: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function profile() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const profileData = {
    name: "Laal Singh Chaddha",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  };

  const menuItems = [
    { id: 1, title: "Your Profile", icon: "👤", screen: "your_profile", color: "text-gray-700" },
    { id: 2, title: "Payment Method", icon: "💳", screen: "PaymentMethod", color: "text-blue-600" },
    { id: 3, title: "Settings", icon: "⚙️", screen: "Settings", color: "text-blue-600" },
    { id: 4, title: "Help Center", icon: "❓", screen: "HelpCenter", color: "text-gray-700" },
    { id: 5, title: "Privacy Policy", icon: "🛡️", screen: "PrivacyPolicy", color: "text-gray-700" },
    { id: 6, title: "Invites Friends", icon: "👥", screen: "InviteFriends", color: "text-gray-700" },
    { id: 7, title: "Log Out", icon: "🚪", screen: "LogOut", color: "text-gray-700" },
  ];

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.screen === "LogOut") {
      console.log("Logging out...");
      // navigation.reset({ index: 0, routes: [{ name: "(auth)/login" }] });
      navigation.navigate("login");
      return;
    }
    navigation.navigate(item.screen as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-xl font-bold text-gray-800 text-center">Profile</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View className="items-center py-8">
          <View className="w-24 h-24 bg-red-500 rounded-full justify-center items-center mb-4">
            <Image
              source={{ uri: profileData.avatar }}
              className="w-20 h-20 rounded-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-xl font-semibold text-gray-800">{profileData.name}</Text>
        </View>

        {/* Menu Items */}
        <View className="px-4 rounded-t-3xl mb-3">
          {menuItems.map((item) => (
            <Pressable
              key={item.id}
              className="flex-row items-center justify-between py-4 border-b border-gray-200 mb-2"
              onPress={() => handleMenuPress(item)}
              android_ripple={{ color: "#e5e7eb" }}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 justify-center items-center mr-4">
                  <Text className="text-xl">{item.icon}</Text>
                </View>
                <Text className={`text-base font-medium ${item.color}`}>{item.title}</Text>
              </View>
              <Text className="text-gray-400 text-lg">›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
