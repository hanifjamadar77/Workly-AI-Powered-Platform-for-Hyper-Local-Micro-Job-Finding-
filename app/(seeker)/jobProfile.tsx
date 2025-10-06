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

// Define DefaultDocument type if not imported from elsewhere
type DefaultDocument = {
  $id: string;
  fullName?: string;
  skills?: string[];
  rating?: number;
  availability?: string;
  // Add other fields as needed based on your data structure
};

export default function jobProfile() {
  const router = useRouter();
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

  // Filter profiles based on search
  const filteredProfiles = allProfiles.filter((profile) =>
    profile.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Categorize profiles
  const topRatedProfiles = filteredProfiles.filter(p => typeof p.rating === "number" && p.rating >= 4.5).slice(0, 6);
  const availableProfiles = filteredProfiles.filter(p => p.availability === 'Available').slice(0, 6);
  const allOtherProfiles = filteredProfiles.slice(0, 10);

  const handleProfilePress = (profile: { $id: any; }) => {
    router.push({
      pathname: "../supportPages/WorkerProfile",
      params: { profileId: profile.$id }
    });
  };

  const handleAddProfile = () => {
    router.push("/profileScreens/yourProfile");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-gray-600 mt-4">Loading profiles...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white mb-20">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-xl font-bold text-gray-800 text-center">
          Worker Profiles
        </Text>
      </View>

      {/* Search Bar */}
      <Search
        placeholder="Search workers or skills..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onPress={() => console.log("Searching...")}
      />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Top Rated Profiles */}
        {topRatedProfiles.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 px-4 mb-4 mt-4">
              ⭐ Top Rated Workers
            </Text>
            <View className="flex-row flex-wrap justify-evenly">
              {topRatedProfiles.map((profile) => (
                <JobProfileCard
                  key={profile.$id}
                  profile={profile}
                  onPress={handleProfilePress}
                />
              ))}
            </View>
          </View>
        )}

        {/* Available Now */}
        {availableProfiles.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 px-4 mb-4">
              ✅ Available Now
            </Text>
            <View className="flex-row flex-wrap justify-evenly">
              {availableProfiles.map((profile) => (
                <JobProfileCard
                  key={profile.$id}
                  profile={profile}
                  onPress={handleProfilePress}
                />
              ))}
            </View>
          </View>
        )}

        {/* All Workers */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 px-4 mb-4">
            All Workers
          </Text>
          {allOtherProfiles.length === 0 ? (
            <Text className="text-center text-gray-500 py-10">
              No worker profiles found
            </Text>
          ) : (
            <View className="flex-row flex-wrap justify-evenly">
              {allOtherProfiles.map((profile) => (
                <JobProfileCard
                  key={profile.$id}
                  profile={profile}
                  onPress={handleProfilePress}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full justify-center items-center shadow-lg"
        onPress={handleAddProfile}
        activeOpacity={0.8}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}