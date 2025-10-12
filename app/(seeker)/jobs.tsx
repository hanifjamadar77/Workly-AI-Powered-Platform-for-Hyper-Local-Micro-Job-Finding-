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

export default function Jobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const jobList = await getAllJobs();
      console.log("📦 Jobs with user data:", jobList);
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
    <SafeAreaView className="flex-1 bg-white">
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
          />

          <Text className="text-xl text-gray-800 font-semibold my-5">
            Available Jobs
          </Text>

          {/* Loading Indicator */}
          {loading ? (
            <ActivityIndicator size="large" color="#6366f1" />
          ) : filteredJobs.length === 0 ? (
            <Text className="text-gray-500 text-center mt-8">
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
                    icon={job.avatarUrl} // ✅ User avatar
                    userName={toSentenceCase(job.userName)} // ✅ User name
                    backgroundColor="bg-green-100"
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
            className="mt-4 bg-indigo-600 py-3 rounded-xl"
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