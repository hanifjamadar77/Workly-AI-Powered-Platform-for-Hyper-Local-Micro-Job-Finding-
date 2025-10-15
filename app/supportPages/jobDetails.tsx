import React, { useEffect, useState } from "react";
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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { ID, Query } from "appwrite";
import { appwriteConfig, createNotification, createJobApplication, databases, getCurrentUser } from "@/lib/appwrite";
import Header from "../../components/profileHeader";
import { useRouter } from "expo-router";

// --------------------- TYPES ---------------------
interface JobData {
  $id: string;
  title: string;
  description: string;
  pay: string;
  peopleNeeded: string;
  startDate: string;
  endDate: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  userId: string;
  userName: string;
  createdDate: string;
}

interface PosterData {
  $id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
}

type JobDetailsRouteParams = {
  jobId: string;
};

type JobDetailsRouteProp = RouteProp<{ JobDetails: JobDetailsRouteParams }, "JobDetails">;

interface JobDetailsProps {
  route?: JobDetailsRouteProp;
}

// --------------------- COMPONENT ---------------------
export default function JobDetailsPage(props: JobDetailsProps) {
  const routeFromProp = props?.route;
  const router = useRouter();
  const routeHook = useRoute<JobDetailsRouteProp>();
  const route = routeFromProp ?? routeHook;
  const { jobId } = route?.params || {};

  const [jobData, setJobData] = useState<JobData | null>(null);
  const [posterData, setPosterData] = useState<PosterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const navigation = useNavigation<any>();

  // ---------------- FETCH JOB ----------------
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobDoc = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.jobCollectionId,
          jobId
        );

        if (jobDoc) {
          setJobData(jobDoc as unknown as JobData);

          // Fetch poster info
          if (jobDoc.userId) {
            const userDocs = await databases.listDocuments(
              appwriteConfig.databaseId,
              appwriteConfig.userCollectionId,
              [Query.equal("accountId", jobDoc.userId)]
            );

            if (userDocs.documents.length > 0) {
              setPosterData(userDocs.documents[0] as unknown as PosterData);
            }
          }

          // Check if already applied
          checkIfApplied(jobDoc.$id);
        }
      } catch (err) {
        console.error("❌ Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  // ---------------- CHECK APPLICATION ----------------
  const checkIfApplied = async (jobId: string) => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      const existingApps = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.applicationsCollectionId,
        [
          Query.equal("jobId", jobId),
          Query.equal("workerId", currentUser.$id),
        ]
      );

      if (existingApps.documents.length > 0) setHasApplied(true);
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

// ---------------- APPLY JOB ----------------
const handleApplyForJob = async () => {
  if (!jobData) {
    Alert.alert("Error", "Job data not loaded yet.");
    return;
  }

  try {
    setApplying(true);

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      Alert.alert("Login Required", "Please login to apply for this job.");
      return;
    }

    // Fetch worker profile
    const workerDocs = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentUser.$id)]
    );

    // Use first document if exists, otherwise fallback to currentUser info
    const workerProfile = workerDocs.documents[0] || {
      name: currentUser.name,
      email: currentUser.email,
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      phone: "",
    };

    // Build application data
    const applicationData = {
      jobId: jobData.$id,
      workerId: currentUser.$id,
      posterId: jobData.userId,
      workerName: workerProfile.name,
      workerEmail: workerProfile.email,
      workerPhone: workerProfile.phone,
      workerAvatar: workerProfile.avatar,
      jobTitle: jobData.title,
      jobPay: jobData.pay,
      jobCity: jobData.city,
      jobStartDate: jobData.startDate,
    };

    // Create the job application
    const application = await createJobApplication(applicationData);

    // Create notification for job poster
    await createNotification({
      recipientId: jobData.userId,
      senderId: currentUser.$id,
      type: "APPLICATION",
      title: `${workerProfile.name} applied for ${jobData.title}`,
      message: `${workerProfile.name} has applied for your job "${jobData.title}".`,
      jobId: jobData.$id,
      applicationId: application.$id,
      jobDetails: {
        jobId: jobData.$id,
        title: jobData.title,
        pay: jobData.pay,
        city: jobData.city,
        startDate: jobData.startDate,
        peopleNeeded: jobData.peopleNeeded,
      },
      workerDetails: {
        id: currentUser.$id,
        name: workerProfile.name,
        email: workerProfile.email,
        phone: workerProfile.phone,
        avatar: workerProfile.avatar,
      },
    });

    setHasApplied(true);

    Alert.alert(
      "✅ Application Submitted",
      "Your application has been sent successfully. You’ll get a notification once the job poster reviews it.",
      [
        {
          text: "View Notifications",
          onPress: () => router.push('/(seeker)/notifications'),
        },
        { text: "OK", style: "cancel" },
      ]
    );
  } catch (error: any) {
    console.error("Error applying for job:", error);
    Alert.alert("Error", error?.message || "Something went wrong.");
  } finally {
    setApplying(false);
  }
};



  // ---------------- UTILITIES ----------------
  const toSentenceCase = (text?: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

  const formatDate = (dateString?: string) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  // ---------------- LOADING ----------------
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
        <Text className="text-xl text-gray-800 font-semibold mb-2">Job Not Found</Text>
        <Text className="text-gray-600 mb-6">This job may have been removed</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-indigo-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );

  // ---------------- MAIN UI ----------------
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Header title="Job Details" />

        {/* Hero Section */}
        <View className="bg-indigo-600 mx-4 mt-4 rounded-3xl p-6 shadow-lg">
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

        {/* Description */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">📝 Description</Text>
          </View>
          <Text className="text-gray-700 leading-6">{jobData.description}</Text>
        </View>

        {/* Job Info */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">ℹ️ Job Information</Text>
          <View className="space-y-3">
            <Text className="text-gray-800">
              📅 Start Date: <Text className="font-bold">{formatDate(jobData.startDate)}</Text>
            </Text>
            <Text className="text-gray-800">
              📅 End Date: <Text className="font-bold">{formatDate(jobData.endDate)}</Text>
            </Text>
            <Text className="text-gray-800">
              👥 People Needed: <Text className="font-bold">{jobData.peopleNeeded}</Text>
            </Text>
            <Text className="text-gray-800">
              💰 Payment: <Text className="text-green-600 font-bold">₹{jobData.pay}</Text>
            </Text>
          </View>
        </View>

        {/* Location */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">📍 Location</Text>
          <Text className="text-gray-700 font-medium mb-1">
            {jobData.houseNumber}, {toSentenceCase(jobData.street)}
          </Text>
          <Text className="text-gray-700">
            {toSentenceCase(jobData.city)}, {toSentenceCase(jobData.state)}
          </Text>
          <Text className="text-gray-600 mt-2">📮 Pincode: {jobData.pincode}</Text>
        </View>

        {/* Posted By */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">👤 Posted By</Text>
          {posterData ? (
            <View className="flex-row items-center">
              <Image
                source={
                  posterData.avatar
                    ? { uri: posterData.avatar }
                    : require("@/assets/images/man.png")
                }
                className="w-12 h-12 rounded-full mr-3 bg-gray-200"
              />
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {toSentenceCase(posterData.name)}
                </Text>
                <Text className="text-sm text-gray-600">{posterData.email}</Text>
              </View>
            </View>
          ) : (
            <Text className="text-gray-600">User info not available</Text>
          )}
        </View>

        {/* Apply Button */}
        <View className="mx-4 mt-6 mb-8">
          {!hasApplied ? (
            <TouchableOpacity
              onPress={handleApplyForJob}
              disabled={applying}
              className={`${
                applying ? "bg-gray-400" : "bg-indigo-600"
              } py-4 rounded-xl shadow-lg mb-3`}
            >
              {applying ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Apply for this Job
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => router.push('/(seeker)/notifications')}
              className="bg-indigo-600 py-4 rounded-xl shadow-lg mb-3"
            >
              <Text className="text-white text-center font-bold text-lg">
                View Notifications
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
