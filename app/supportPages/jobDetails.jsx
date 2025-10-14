import { images } from "@/constants";
import { appwriteConfig, databases } from "@/lib/appwrite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
  const { jobId } = route?.params || {};
  const [jobData, setJobData] = useState(null);
  const [posterData, setPosterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.jobCollectionId,
          jobId
        );

        if (jobDoc) {
          setJobData(jobDoc);

          // Fetch poster information
          if (jobDoc.userId) {
            try {
              const userDocs = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.userCollectionId,
                [Query.equal("accountId", jobDoc.userId)]
              );

              if (userDocs.documents.length > 0) {
                setPosterData(userDocs.documents[0]);
              }
            } catch (error) {
              console.warn("⚠️ Failed to fetch user data:", error);
            }
          }
        } else {
          console.warn("⚠️ Job not found:", jobId);
        }
      } catch (err) {
        console.error("❌ Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-gray-600 mt-2">Loading job details...</Text>
      </SafeAreaView>
    );

  if (!jobData)
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl text-gray-800 font-semibold mb-2">
          Job Not Found
        </Text>
        <Text className="text-gray-600 mb-6">
          This job may have been removed
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-indigo-600 px-6 py-3 rounded-xl"
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

        {/* Hero Section - Job Title & Quick Info */}
        <View className="bg-gradient-to-br from-indigo-500 to-purple-600 mx-4 mt-4 rounded-3xl p-6 shadow-lg" style={{ backgroundColor: '#6366f1' }}>
          <Text className="text-2xl font-bold text-white mb-2">
            {toSentenceCase(jobData.title)}
          </Text>
          <View className="flex-row items-center mt-3">
            <View className="bg-white bg-opacity-20 px-4 py-2 rounded-full mr-2">
              <Text className="text-green-600 font-semibold">₹{jobData.pay}</Text>
            </View>
            <View className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              <Text className="text-black font-semibold">
                👥 {jobData.peopleNeeded || 1} needed
              </Text>
            </View>
          </View>
        </View>

        {/* Description Card */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-indigo-100 rounded-full justify-center items-center mr-3">
              <Text className="text-lg">📝</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">Description</Text>
          </View>
          <Text className="text-gray-700 leading-6">{jobData.description}</Text>
        </View>

        {/* Job Details Grid */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-indigo-100 rounded-full justify-center items-center mr-3">
              <Text className="text-lg">ℹ️</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">Job Information</Text>
          </View>

          <View className="space-y-3">
            {/* Start Date */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">📅</Text>
                <Text className="text-gray-600 font-medium">Start Date</Text>
              </View>
              <Text className="text-gray-800 font-bold">
                {formatDate(jobData.startDate)}
              </Text>
            </View>

            {/* End Date */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">📅</Text>
                <Text className="text-gray-600 font-medium">End Date</Text>
              </View>
              <Text className="text-gray-800 font-bold">
                {formatDate(jobData.endDate)}
              </Text>
            </View>

            {/* People Needed */}
            <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">👥</Text>
                <Text className="text-gray-600 font-medium">People Needed</Text>
              </View>
              <Text className="text-gray-800 font-bold">
                {jobData.peopleNeeded || 1}
              </Text>
            </View>

            {/* Payment */}
            <View className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">💰</Text>
                <Text className="text-gray-600 font-medium">Payment</Text>
              </View>
              <Text className="text-green-600 font-bold text-lg">₹{jobData.pay}</Text>
            </View>
          </View>
        </View>

        {/* Location Card */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-100 rounded-full justify-center items-center mr-3">
              <Text className="text-lg">📍</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">Location</Text>
          </View>
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-700 font-medium mb-1">
              {jobData.houseNumber}, {toSentenceCase(jobData.street)}
            </Text>
            <Text className="text-gray-700">
              {toSentenceCase(jobData.city)}, {toSentenceCase(jobData.state)}
            </Text>
            <Text className="text-gray-600 mt-2">📮 Pincode: {jobData.pincode}</Text>
          </View>
        </View>

        {/* Posted By Card */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-purple-100 rounded-full justify-center items-center mr-3">
              <Text className="text-lg">👤</Text>
            </View>
            <Text className="text-lg font-bold text-gray-800">Posted By</Text>
          </View>

          {posterData ? (
            <View className="flex-row items-center">
              <Image
                source={{ uri: posterData.avatar }}
                className="w-12 h-12 rounded-full mr-3 bg-gray-200"
              />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {toSentenceCase(posterData.name)}
                </Text>
                <Text className="text-sm text-gray-600">{posterData.email}</Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 text-xs font-medium">✓ Verified</Text>
              </View>
            </View>
          ) : (
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-gray-200 rounded-full mr-3 justify-center items-center">
                <Text className="text-xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {toSentenceCase(jobData.userName || "Unknown User")}
                </Text>
                <Text className="text-sm text-gray-600">Job Poster</Text>
              </View>
            </View>
          )}

          <View className="mt-4 pt-4 border-t border-gray-100">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500">Posted on</Text>
              <Text className="text-sm font-medium text-gray-700">
                {formatDate(jobData.createdDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={() => Alert.alert("Apply", "Application submitted successfully!")}
            className="bg-indigo-600 py-4 rounded-xl shadow-lg mb-3"
          >
            <Text className="text-white text-center font-bold text-lg">
              Apply for this Job
            </Text>
          </TouchableOpacity>

          {/* <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => Alert.alert("Contact", "Contact feature coming soon")}
              className="flex-1 bg-green-500 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                📞 Contact
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("Share", "Share feature coming soon")}
              className="flex-1 bg-gray-500 py-3 rounded-xl"
            >
              <Text className="text-white text-center font-semibold">
                📤 Share
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}