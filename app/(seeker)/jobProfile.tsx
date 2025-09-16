import React, { useState } from "react";
import { useRouter } from "expo-router";

import {
  View,
  Text,
  ScrollView,
  TextInput,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import JobProfileCard from "@/components/JobProfileCards";

export default function JobProfileScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Sample data
  const recommendedProfiles = [
    {
      id: 1,
      name: "Cris Ronaldo",
      profession: "Plumber",
      experience: "5 year experience",
      rating: 4.8,
      isTopRated: true,
      availability: "Available",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      backgroundColor: "bg-green-100",
    },
    {
      id: 2,
      name: "Tyler Swift",
      profession: "Baby Sitter",
      experience: "2 year experience",
      rating: 4.9,
      isTopRated: true,
      availability: "Available",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b5a9b0e4?w=150&h=150&fit=crop&crop=face",
      backgroundColor: "bg-purple-100",
    },
  ];

  const nearbyProfiles = [
    {
      id: 3,
      name: "Neha Kakkar",
      profession: "B-Tech Student",
      experience: "1 year experience",
      rating: 4.5,
      isTopRated: false,
      availability: "Available",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      backgroundColor: "bg-blue-100",
    },
    {
      id: 4,
      name: "Neha Kakkar",
      profession: "B-Tech Student",
      experience: "Fresher",
      rating: 4.2,
      isTopRated: false,
      availability: "Available",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      backgroundColor: "bg-yellow-100",
    },
  ];

  const cityProfiles = [
    {
      id: 7,
      name: "Neha Kakkar",
      profession: "B-Tech Student",
      experience: "2 year experience",
      rating: 4.4,
      isTopRated: false,
      availability: "Available",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      backgroundColor: "bg-indigo-100",
    },
    {
      id: 8,
      name: "Neha Kakkar",
      profession: "E-Tech Student",
      experience: "1.5 year experience",
      rating: 4.1,
      isTopRated: false,
      availability: "Available",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b5a9b0e4?w=150&h=150&fit=crop&crop=face",
      backgroundColor: "bg-teal-100",
    },
  ];

  // ✅ Navigate with router
  const handleProfilePress = () => {
    router.push("../supportPages/WorkerProfile"); // 👈 must match your folder
  };

  const handleAddProfile = () => {
    console.log("Add new profile");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-xl font-bold text-gray-800 text-center">
          Job Profile
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-4">
        <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center">
          <Text className="text-gray-500 mr-2">🔍</Text>
          <TextInput
            className="flex-1 text-base"
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Recommended Profiles */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 px-4 mb-4">
            Recommended Profiles
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {recommendedProfiles.map((profile) => (
                <JobProfileCard
                  key={profile.id}
                  profile={profile}
                  onPress={handleProfilePress}
                  backgroundColor={profile.backgroundColor}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* In Your Area */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 px-4 mb-4">
            In your Area
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {nearbyProfiles.map((profile) => (
              <JobProfileCard
                key={profile.id}
                profile={profile}
                onPress={handleProfilePress}
                backgroundColor={profile.backgroundColor}
              />
            ))}
          </View>
        </View>

        {/* In Your City */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 px-4 mb-4">
            In Your City
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {cityProfiles.map((profile) => (
              <JobProfileCard
                key={profile.id}
                profile={profile}
                onPress={handleProfilePress}
                backgroundColor={profile.backgroundColor}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={handleAddProfile}
        activeOpacity={0.8}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
