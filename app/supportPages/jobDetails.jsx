import { images } from "@/constants";
import { appwriteConfig, databases } from "@/lib/appwrite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/profileHeader";

export default function JobDetailsPage(props) {
  const routeFromProp = props?.route;
  const routeHook = useRoute();
  const route = routeFromProp ?? routeHook;
  const { jobId } = route?.params || {}; // fetch job by jobId
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        let jobDoc = null;
        try {
          jobDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.jobCollectionId,
            jobId
          );
        } catch {
          const jobList = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.jobsCollectionId,
            [Query.equal("userId", [jobId])]
          );
          if (jobList.total > 0) jobDoc = jobList.documents[0];
        }
        if (jobDoc) setJobData(jobDoc);
        else console.warn("⚠️ Job not found:", jobId);
      } catch (err) {
        console.error("❌ Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="blue" />
        <Text className="text-gray-600 mt-2">Loading job details...</Text>
      </SafeAreaView>
    );

  if (!jobData)
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Job details not found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Header title="Job Details" />

        {/* Job Info */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-2">
            {jobData.title}
          </Text>

          <Text className="text-gray-600 mb-4">{jobData.description}</Text>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600 font-medium">Pay:</Text>
            <Text className="text-gray-800 font-bold">{jobData.pay}</Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600 font-medium">People Needed:</Text>
            <Text className="text-gray-800 font-bold">
              {jobData.peopleNeeded || 1}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600 font-medium">Start Date:</Text>
            <Text className="text-gray-800 font-bold">
              {jobData.startDate
                ? new Date(jobData.startDate).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>

          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-600 font-medium">End Date:</Text>
            <Text className="text-gray-800 font-bold">
              {jobData.endDate
                ? new Date(jobData.endDate).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-600 font-medium mb-1">Address:</Text>
            <Text className="text-gray-800">
              {jobData.houseNumber}, {jobData.street}
            </Text>
            <Text className="text-gray-800">
              {jobData.city}, {jobData.state} - {jobData.pincode}
            </Text>
          </View>

          <View className="flex-row justify-between mt-4">
            <Text className="text-gray-600">Posted By:</Text>
            <Text className="text-gray-800 font-bold">{jobData.userId}</Text>
          </View>

          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-600">Created On:</Text>
            <Text className="text-gray-800 font-bold">
              {new Date(jobData.createdDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <View className="flex-row mx-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={() => Alert.alert("Apply", "Apply flow not implemented")}
            className="flex-1 bg-indigo-600 py-4 rounded-xl"
          >
            <Text className="text-white text-center font-semibold">
              Apply for Job
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
