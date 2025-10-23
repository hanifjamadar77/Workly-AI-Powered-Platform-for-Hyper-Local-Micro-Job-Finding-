import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getApplicationsByWorker, getCurrentUser } from "@/lib/appwrite";
import Header from "@/components/profileHeader";

export default function RequestedJobsScreen() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Fetch applications of logged-in worker
  const fetchWorkerApplications = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      if (!user) {
        console.log("No logged-in user found");
        return;
      }

      setCurrentUser(user);
      console.log("Fetching job applications for:", user.$id);

      const apps = await getApplicationsByWorker(user.$id);
      console.log("Worker applications fetched:", apps.length);

      setApplications(apps);
    } catch (error) {
      console.error("❌ Error fetching worker applications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWorkerApplications();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWorkerApplications();
  };

  const ApplicationCard = ({ app }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={() =>
        router.push(`/supportPages/jobDetails?jobId=${app.jobId}`)
      }
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800 mb-1">
            {app.jobTitle}
          </Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            Applied on {new Date(app.appliedAt).toLocaleDateString()}
          </Text>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${
            app.status === "ACCEPTED"
              ? "bg-green-100"
              : app.status === "REJECTED"
              ? "bg-red-100"
              : "bg-yellow-100"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              app.status === "ACCEPTED"
                ? "text-green-700"
                : app.status === "REJECTED"
                ? "text-red-700"
                : "text-yellow-700"
            }`}
          >
            {app.status}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap mb-3">
        <View className="flex-row items-center mr-4 mb-2">
          <Text className="text-gray-500 mr-1">📍</Text>
          <Text className="text-sm text-gray-600">{app.jobCity}</Text>
        </View>
        <View className="flex-row items-center mr-4 mb-2">
          <Text className="text-gray-500 mr-1">💰</Text>
          <Text className="text-sm font-semibold text-gray-800">
            ₹{app.jobPay}
          </Text>
        </View>
        <View className="flex-row items-center mb-2">
          <Text className="text-gray-500 mr-1">📅</Text>
          <Text className="text-sm text-gray-600">
            {app.jobStartDate
              ? new Date(app.jobStartDate).toLocaleDateString()
              : "N/A"}
          </Text>
        </View>
      </View>

      <View className="pt-3 border-t border-gray-100">
        <Text className="text-xs text-gray-500">
          Job ID: {app.jobId.slice(0, 8)}...
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <Header title="Requested Jobs" />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-gray-500 mt-4">Loading your requests...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* ✅ Stats card */}
          <View
            className="bg-indigo-600 rounded-2xl p-5 mb-4"
            style={{ backgroundColor: "#6366f1" }}
          >
            <Text className="text-white text-sm opacity-90 mb-1">
              Total Jobs Requested
            </Text>
            <Text className="text-white text-3xl font-bold">
              {applications.length}
            </Text>
          </View>

          {/* ✅ Applications list */}
          {applications.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-6xl mb-4">📄</Text>
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                No Job Requests Yet
              </Text>
              <Text className="text-sm text-gray-600 text-center mb-6 px-6">
                You haven’t applied for any jobs yet.
              </Text>
              <TouchableOpacity
                className="bg-indigo-600 px-6 py-3 rounded-xl"
                onPress={() => router.replace("/(poster)/home")}
              >
                <Text className="text-white font-semibold">
                  Browse Available Jobs
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text className="text-base font-semibold text-gray-800 mb-3">
                Your Job Requests
              </Text>
              {applications.map((app) => (
                <ApplicationCard key={app.$id} app={app} />
              ))}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
