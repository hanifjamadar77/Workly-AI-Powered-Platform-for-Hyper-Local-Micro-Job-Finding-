import { images } from "@/constants";
import { appwriteConfig, databases } from "@/lib/appwrite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/profileHeader";

export default function WorkerProfileTest(props) {
  const routeFromProp = props?.route;
  const routeHook = useRoute();
  const route = routeFromProp ?? routeHook;
  const { profileId } = route?.params || {};
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // ✅ Action Handlers
  const handleCall = () => {
    if (worker?.phone) {
      Linking.openURL(`tel:${worker.phone}`).catch(() =>
        Alert.alert("Error", "Unable to place call")
      );
    } else {
      Alert.alert("No phone", "This worker has no phone number");
    }
  };

  const handleEmail = () => {
    if (worker?.email) {
      Linking.openURL(`mailto:${worker.email}`).catch(() =>
        Alert.alert("Error", "Unable to open email client")
      );
    } else {
      Alert.alert("No email", "This worker has no email address");
    }
  };

  // const handleMessage = () => Alert.alert('Message', 'Messaging is not implemented yet.');
  const handleHire = () =>
    Alert.alert("Hire", "Hire flow is not implemented yet.");

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        console.log("🔍 Fetching worker for profileId:", profileId);

        let workerDoc = null;
        try {
          workerDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.workerCollectionId,
            profileId
          );
        } catch {
          const profileList = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.workerCollectionId,
            [Query.equal("userId", [profileId])]
          );
          if (profileList.total > 0) workerDoc = profileList.documents[0];
        }

        if (workerDoc) setWorker(workerDoc);
        else
          console.warn("⚠️ No worker found for profileId/userId:", profileId);
      } catch (err) {
        console.error("❌ Error fetching worker:", err);
      } finally {
        setLoading(false);
      }
    };

    if (profileId) fetchWorker();
  }, [profileId]);

  if (loading)
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="blue" />
        <Text className="text-gray-600 mt-2">Loading profile...</Text>
      </SafeAreaView>
    );

  if (!worker)
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Worker profile not found</Text>
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
        <Header title="Worker Profile" />

        {/* Profile */}
        <View className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm items-center">
          <Image
            source={{
              uri: worker.profilePhoto || "https://via.placeholder.com/150",
            }}
            className="w-20 h-20 rounded-full mb-3"
            resizeMode="cover"
          />
          <Text className="text-xl font-bold text-gray-800 mb-1">
            {worker.fullName}
          </Text>

           <Text className="text-gray-600 mb-4 mt-4 text-center">
            {worker.about || "No bio available"}
          </Text>

          <Text className="text-gray-600 mb-2 font-bold">
            {worker.experience} Experience
          </Text>

          <View
            className={`px-3 py-1 rounded-full mb-3 ${
              worker.availability === "Available"
                ? "bg-green-100"
                : worker.availability === "Busy"
                ? "bg-yellow-100"
                : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                worker.availability === "Available"
                  ? "text-green-700"
                  : worker.availability === "Busy"
                  ? "text-yellow-700"
                  : "text-gray-700"
              }`}
            >
              {worker.availability}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between items-center mb-4 px-6">
            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {worker.rating?.toFixed(1) || "0.0"}
              </Text>
              <Text className="text-xs text-gray-600">Rating</Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {worker.completedJobs || 0}
              </Text>
              <Text className="text-xs text-gray-600">Jobs Done</Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-lg font-bold text-gray-800">
                {worker.age || "N/A"}
              </Text>
              <Text className="text-xs text-gray-600">Age</Text>
            </View>
          </View>

          {worker.gender && (
            <View className="bg-indigo-100 px-4 py-1 rounded-full self-center ml-6 mb-2">
              <Text className="text-indigo-700 text-sm font-medium">
                {worker.gender}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row mx-4  mt-4 mb-8 space-x-3">
          <TouchableOpacity
            className="flex-1 bg-green-500 py-4 rounded-xl mr-4"
            onPress={handleCall}
          >
            <Text className="text-white text-center font-semibold">
              📞 Call
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-indigo-600 py-4 rounded-xl"
            onPress={handleEmail}
          >
            <Text className="text-white text-center font-semibold">
              💬 Message
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Hire Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full justify-center items-center shadow-lg"
        onPress={handleHire}
      >
        <Text className="text-white text-2xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}