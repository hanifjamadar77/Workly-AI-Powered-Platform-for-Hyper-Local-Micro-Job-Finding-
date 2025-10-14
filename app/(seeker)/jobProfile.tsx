import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import JobProfileCard from "@/components/JobProfileCards";
import Search from "@/components/Search";
import { getAllWorkerProfiles } from "@/lib/appwrite";
import { useTheme } from "@/lib/ThemeContext";

// Define DefaultDocument type
type DefaultDocument = {
  $id: string;
  fullName?: string;
  skills?: string[];
  rating?: number;
  availability?: string;
};

export default function JobProfileScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [allProfiles, setAllProfiles] = useState<DefaultDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const profiles = await getAllWorkerProfiles();
      setAllProfiles(profiles);
      console.log("✅ Fetched profiles:", profiles.length);
    } catch (error) {
      console.error("❌ Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfiles();
    setRefreshing(false);
  };

  // Filter profiles based on search & availability
  const filteredProfiles = allProfiles
    .filter(
      (p) =>
        p.availability?.toLowerCase() === "available" ||
        p.availability?.toLowerCase() === "busy"
    )
    .filter(
      (profile) =>
        profile.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.skills?.some((skill: string) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

  // Categorize profiles
  const topRatedProfiles = filteredProfiles
    .filter((p) => typeof p.rating === "number" && p.rating >= 4.5)
    .slice(0, 6);
  const availableProfiles = filteredProfiles
    .filter((p) => p.availability?.toLowerCase() === "available")
    .slice(0, 6);
  const allOtherProfiles = filteredProfiles.slice(0, 10);

  const handleProfilePress = (profile: { $id: any }) => {
    router.push({
      pathname: "../supportPages/WorkerProfile",
      params: { profileId: profile.$id },
    });
  };

  const handleAddProfile = () => {
    router.push("/profileScreens/yourProfile");
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        className="justify-center items-center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text }} className="mt-4">
          Loading profiles...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      className="mb-20"
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View className="px-4 py-4">
        <Text
          style={{ color: colors.text }}
          className="text-xl font-bold text-center"
        >
          Worker Profiles
        </Text>
      </View>

      {/* Search Bar */}
      <Search
        placeholder="Search workers or skills..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onPress={() => console.log("Searching...")}
        placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
        inputBgColor={isDarkMode ? "#2c2c2c" : "#f1f1f1"}
        inputTextColor={isDarkMode ? "#fff" : "#000"}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Top Rated Profiles */}
        {topRatedProfiles.length > 0 && (
          <View className="mb-6">
            <Text
              style={{ color: colors.text }}
              className="text-lg font-bold px-4 mb-4 mt-4"
            >
              ⭐ Top Rated Workers
            </Text>
            <View className="flex-row flex-wrap justify-evenly">
              {topRatedProfiles.map((profile) => (
                <JobProfileCard
                  key={profile.$id}
                  profile={profile}
                  onPress={handleProfilePress}
                  isDarkMode={isDarkMode}
                />
              ))}
            </View>
          </View>
        )}

        {/* Available Now */}
        {availableProfiles.length > 0 && (
          <View className="mb-6">
            <Text
              style={{ color: colors.text }}
              className="text-lg font-bold px-4 mb-4 mt-4"
            >
              ✅ Available Now
            </Text>
            <View className="flex-row flex-wrap justify-evenly">
              {availableProfiles.map((profile) => (
                <JobProfileCard
                  key={profile.$id}
                  profile={profile}
                  onPress={handleProfilePress}
                  isDarkMode={isDarkMode}
                />
              ))}
            </View>
          </View>
        )}

        {/* All Workers */}
        <View className="mb-8">
          <Text
            style={{ color: colors.text }}
            className="text-lg font-bold px-4 mb-4"
          >
            All Workers
          </Text>
          {allOtherProfiles.length === 0 ? (
            <Text
              style={{ color: colors.textSecondary }}
              className="text-center py-10"
            >
              No worker profiles found
            </Text>
          ) : (
            <View className="flex-row flex-wrap justify-evenly">
              {allOtherProfiles.map((profile) => (
                <JobProfileCard
                  key={profile.$id}
                  profile={profile}
                  onPress={handleProfilePress}
                  isDarkMode={isDarkMode}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        style={{
          backgroundColor: isDarkMode ? "#4f46e5" : "#6366f1",
        }}
        onPress={handleAddProfile}
        activeOpacity={0.8}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
