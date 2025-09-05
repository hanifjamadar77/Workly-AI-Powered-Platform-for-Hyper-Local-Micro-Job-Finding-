import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobDetails({ route }) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Job Details" });
  }, [navigation]);

  // Get job data from navigation params
  const { job } = route?.params || {};

  // Sample job data if none provided
  const jobData = job || {
    id: 1,
    title: "Home Painting",
    description:
      "2 bed rooms\nI want to paint two bed rooms. Paint is available just want a person having knowledge of painting . If any one is available please contact I want to complete this task before 14 Aug. Money we will discuss.",
    image:
      "https://imgs.search.brave.com/9l7MicBRyeYG86g8jD4zP-ZvK2lRn-96_X5LPSmcEqI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Zmxvd3JpZ2h0cGx1/bWJlcnN3b2tpbmcu/Y28udWsvd3AtY29u/dGVudC91cGxvYWRz/LzIwMjMvMTAvQmF0/aHJvb21fRml0dGVy/c19Xb2tpbmdfR1Uy/MS5qcGc",
    employer: {
      name: "Harry Peter",
      phone: "+91 9857204525",
      address: "near main bus stop, guru krupa, 521",
      location: {
        latitude: 18.5204,
        longitude: 73.8567,
      },
    },
  };

  const handleRequest = () => {
    Alert.alert(
      "Request Sent!",
      "Your request has been sent to the employer. They will contact you soon.",
      [{ text: "OK" }]
    );
  };

  const handleCall = () => {
    Alert.alert(
      "Call Employer",
      `Do you want to call ${jobData.employer.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Calling...") },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 flex-col bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} style={{margin : "8"}}>
        {/* Job Image */}
        <View className="px-4 mb-4">
          <View className="rounded-2xl overflow-hidden">
            <Image
              source={{ uri: jobData.image }}
              style={{ width: "100%", height: 200 }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Request Button */}
        <View style={{marginBottom : "10",}}>
          <TouchableOpacity
            style={{
              padding: "10",
              backgroundColor: "lightblue",
              borderRadius: 20,
              margin : "10",
            }}
            onPress={handleRequest}
            activeOpacity={0.8}
          >
            <Text  style = {{ 
              color: "gray",
              fontWeight: "bold",
              fontSize: 18,
              textAlign: 'center',
              }}>
              REQUEST
            </Text>
          </TouchableOpacity>
        </View>

        {/* Job Title */}
        <View className="px-4 mb-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {jobData.title}
          </Text>
        </View>

        {/* Job Description */}
        <View className="px-4 mb-8">
          <Text className="text-base text-gray-700 leading-6">
            {jobData.description}
          </Text>
        </View>

        {/* Personal Details Section */}
        <View className="px-4 mb-6">
          <Text style={
            {
              // color: "gray",
              fontWeight: "bold",
              fontSize: 18,
              textAlign: 'start',
            }
          }>
            Personal Details
          </Text>

          {/* Employer Info */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-800">
                {jobData.employer.name}
              </Text>
              <TouchableOpacity
                onPress={handleCall}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">Call</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-2">
              📞 {jobData.employer.phone}
            </Text>

            <Text className="text-gray-600">
              📍 Address: {jobData.employer.address}
            </Text>
          </View>

          {/* Map Placeholder */}
          <View className="rounded-2xl overflow-hidden h-48 bg-gray-200 justify-center items-center">
            <View className="bg-white rounded-lg p-4 shadow-lg">
              <View className="w-12 h-12 bg-red-500 rounded-full justify-center items-center mb-2">
                <Text className="text-white text-lg">📍</Text>
              </View>
              <Text className="text-sm text-gray-600 text-center">
                Location on Map
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
