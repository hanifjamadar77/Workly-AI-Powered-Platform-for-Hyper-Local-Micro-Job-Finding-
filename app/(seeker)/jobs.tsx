import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import JobCard from "@/components/JobCard";
import Search from "@/components/Search";
import { getAllJobs } from "@/lib/appwrite";
import { useTheme } from "@/lib/ThemeContext";

export default function Jobs() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = async () => {
    try {
      const jobList = await getAllJobs();
      setJobs(jobList);
      console.log("✅ Fetched jobs:", jobList.length);
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toSentenceCase = (text: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors.background : "#f9f9f9",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[isDarkMode ? "#818CF8" : "#4F46E5"]} // Android
            tintColor={isDarkMode ? "#818CF8" : "#4F46E5"} // iOS
            title="Pull to refresh"
            titleColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            progressBackgroundColor={isDarkMode ? "#1F2937" : "#FFFFFF"}
          />
        }
      >
        <View className="mt-4 mx-4">
          {/* Header */}
          <View className="mb-4">
            <Text
              style={{ color: colors.text }}
              className="text-2xl font-bold"
            >
              Find Jobs
            </Text>
            <Text
              style={{ color: colors.textSecondary }}
              className="text-sm mt-1"
            >
              {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
            </Text>
          </View>

          {/* Search Bar */}
          <Search
            placeholder="Search jobs, location or users..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onPress={() => console.log("Searching...")}
            // placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
            // inputBgColor={isDarkMode ? "#374151" : "#F3F4F6"}
            // inputTextColor={isDarkMode ? "#F9FAFB" : "#111827"}
          />

          {/* Section Title */}
          <View className="flex-row items-center justify-between my-5">
            <Text
              style={{ color: colors.text }}
              className="text-xl font-semibold"
            >
              Available Jobs
            </Text>
            {refreshing && (
              <Text
                style={{ color: colors.primary }}
                className="text-xs font-medium"
              >
                Refreshing...
              </Text>
            )}
          </View>

          {/* Loading Indicator */}
          {loading && !refreshing ? (
            <View className="items-center justify-center py-20">
              <ActivityIndicator
                size="large"
                color={isDarkMode ? "#818CF8" : "#4F46E5"}
              />
              <Text
                style={{ color: colors.textSecondary }}
                className="mt-4 text-sm"
              >
                Loading jobs...
              </Text>
            </View>
          ) : filteredJobs.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text
                style={{ color: colors.textSecondary }}
                className="text-center text-base"
              >
                {searchQuery
                  ? "No jobs found matching your search."
                  : "No jobs available at the moment."}
              </Text>
              {searchQuery && (
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-center text-sm mt-2"
                >
                  Try a different search term
                </Text>
              )}
            </View>
          ) : (
            <>
              {/* Job Grid */}
              <View className="flex flex-row flex-wrap justify-between">
                {filteredJobs.map((job, index) => (
                  <View key={job.$id || index} className="w-[48%] mb-4">
                    <JobCard
                      title={toSentenceCase(job.title)}
                      price={job.pay || "N/A"}
                      duration={
                        job.startDate
                          ? new Date(job.startDate).toLocaleDateString()
                          : ""
                      }
                      location={`${toSentenceCase(job.city) || ""}, ${
                        toSentenceCase(job.state) || ""
                      }`}
                      peopleNeeded={job.peopleNeeded || "1"}
                      icon={job.avatarUrl}
                      userName={toSentenceCase(job.userName)}
                      backgroundColor={
                        isDarkMode ? "bg-gray-800" : "bg-green-200"
                      }
                      onPress={() =>
                        router.push({
                          pathname: "../supportPages/jobDetails",
                          params: { jobId: job.$id },
                        })
                      }
                    />
                  </View>
                ))}
              </View>

              {/* Results Count */}
              <View className="mt-4 mb-6">
                <Text
                  style={{ color: colors.textSecondary }}
                  className="text-center text-sm"
                >
                  Showing {filteredJobs.length} of {jobs.length} jobs
                  {searchQuery && ` for "${searchQuery}"`}
                </Text>
              </View>
            </>
          )}

          {/* Pull to refresh hint (only show when not loading) */}
          {!loading && !refreshing && jobs.length > 0 && (
            <View className="items-center py-4">
              <Text
                style={{ color: colors.textSecondary }}
                className="text-xs"
              >
                Pull down to refresh
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}