import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import JobCard from "@/components/JobCard";
import Search from "@/components/Search";
import { getAllJobs } from "@/lib/appwrite";
import { useTheme } from "@/lib/ThemeContext"; // ✅ ThemeContext

export default function Jobs() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme(); // ✅ access dark mode colors

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobList = await getAllJobs();
      setJobs(jobList);
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
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
      style={{ flex: 1, backgroundColor: isDarkMode ? colors.background : "#f9f9f9" }} // ✅ dark/light
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="mt-4 mx-4">
          {/* Search Bar */}
          <Search
            placeholder="Search jobs or users..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onPress={() => console.log("Searching...")}
            // backgroundColor={isDarkMode ? "bg-gray-700" : "bg-gray-100"}
            // textColor={isDarkMode ? "text-white" : "text-gray-800"}
          />

          <Text
            className={`text-xl font-semibold my-5 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Available Jobs
          </Text>

          {/* Loading Indicator */}
          {loading ? (
            <ActivityIndicator size="large"/>
          ) : filteredJobs.length === 0 ? (
            <Text
              className={`text-center mt-8 ${
                isDarkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              No jobs available at the moment.
            </Text>
          ) : (
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
                    backgroundColor={isDarkMode ? "bg-gray-300" : "bg-green-100"} // ✅ dark/light
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
          )}

          {/* Refresh Button */}
          <TouchableOpacity
            onPress={fetchJobs}
            className={`mt-4 py-3 rounded-xl ${
              isDarkMode ? "bg-indigo-500" : "bg-indigo-600"
            }`}
          >
            <Text className="text-white text-center font-semibold">
              Refresh Jobs
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
