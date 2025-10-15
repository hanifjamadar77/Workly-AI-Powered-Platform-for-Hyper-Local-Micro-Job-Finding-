import "react-native-gesture-handler";
import GeminiChatbot from "@/components/GeminiChatbot";
import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";
import JobCard from "@/components/JobCard";
import Search from "@/components/Search";
import { images } from "@/constants";
import { useTheme } from "@/lib/ThemeContext";
import {
  getAllJobs,
  getCurrentUser,
  getWorkerProfileByUserId,
} from "@/lib/appwrite";
import {
  filterJobsByRadius,
  getCityCoordinates,
  sortJobsByDistance,
} from "@/utils/locationUtils";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Job {
  $id: string;
  title?: string;
  pay?: string;
  startDate?: string;
  city?: string;
  state?: string;
  peopleNeeded?: string;
  avatarUrl?: string;
  userName?: string;
  distance?: number;
  [key: string]: any;
}

const Home = () => {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  useEffect(() => {
    loadUserAndJobs();
  }, []);

  const loadUserAndJobs = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      const profile = await getWorkerProfileByUserId(user.accountId);
      setUserProfile(profile);

      let userCoords = null;
      if (profile?.city) userCoords = getCityCoordinates(profile.city);
      if (!userCoords) {
        const deviceLocation = await getUserDeviceLocation();
        if (deviceLocation) {
          userCoords = {
            lat: deviceLocation.coords.latitude,
            lon: deviceLocation.coords.longitude,
          };
        }
      }
      setUserLocation(userCoords);

      const jobs = await getAllJobs();
      const mappedJobs = jobs.map((job: any) => ({
        $id: job.$id,
        title: job.title || job.jobTitle || "",
        pay: job.pay || job.salary || job.payment || "",
        startDate: job.startDate || job.date || "",
        city: job.city || job.location?.city || "",
        state: job.state || job.location?.state || "",
        peopleNeeded: job.peopleNeeded || job.workers || "1",
        avatarUrl: job.avatarUrl || job.avatar || job.userAvatar || "",
        userName: job.userName || job.postedBy || job.employer || "",
        ...job,
      })) as Job[];

      setAllJobs(mappedJobs);

      if (userCoords) {
        const validJobs = mappedJobs.filter((job) => job.city && job.state);
        if (validJobs.length === 0) {
          setNearbyJobs(mappedJobs.slice(0, 2));
          return;
        }
        const sortedJobs = sortJobsByDistance(
          validJobs,
          userCoords.lat,
          userCoords.lon
        );
        const nearby = filterJobsByRadius(
          sortedJobs,
          userCoords.lat,
          userCoords.lon,
          30
        );
        setNearbyJobs(nearby.slice(0, 2));
      } else {
        setNearbyJobs(mappedJobs.slice(0, 3));
      }
    } catch (error) {
      console.error("❌ Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDeviceLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return null;
      return await Location.getCurrentPositionAsync({});
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  };

  const toSentenceCase = (text?: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4" style={{ color: colors.text }}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  const handleSearch = () => console.log("Searching...");
  const handleFocus = () => router.replace("/(seeker)/jobs");

  const Sliderimages = [
    "https://imgs.search.brave.com/TLtgFv9OolO-j3s4jBwVjhTZsaX5n9RnqdaHwIYe95o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdC5k/ZXBvc2l0cGhvdG9z/LmNvbS8xMDIxMDEy/LzEzMzQvaS80NTAv/ZGVwb3NpdHBob3Rv/c18xMzM0Njk4Ni1z/dG9jay1waG90by1j/b25zdHJ1Y3Rpb24t/d29ya2Vycy13b3Jr/aW5nLW9uLWNlbWVu/dC5qcGc",
    "https://imgs.search.brave.com/gLqMJG_IOKQ37ZRN-TXqgEyuM94T8rUoso8vc3Qw3qM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9lbXBsb3llZXMt/M2QtZmxhdC1pY29u/LXZvbHVudGVlcmlu/Zy1jb21tdW5pdHkt/Y2xlYW51cHMtY3Ny/LWluaXRpYXRpdmUt/cHJvbW90aW5nLWVu/dmlyb25tZW5fOTgw/NzE2LTE3OTIyNy5q/cGc_c2VtdD1haXNf/aHlicmlk",
    "https://imgs.search.brave.com/Ga4HBrwZk6gz6VVyvesgGIBSbP0tGzP2xFAl78VISLk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Y293b3JraW5nLXNw/YWNlLWlsbHVzdHJh/dGlvbi13aXRoLXBl/b3BsZS1vZmZpY2Vf/MjMtMjE0ODgyOTA5/Ni5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw",
    "https://imgs.search.brave.com/67xJukDZvUzPb_fezO26cq6Ov9DH78VRkIHhAvU1LVk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90ZWFtLXlvdW5n/LXZvbHVudGVlcnMt/cGFydGljaXBhdGlu/Zy1vdXRkb29yLWNs/ZWFudXAtY2hhcml0/YWJsZS1jYXVzZS1j/b25jZXB0LXZvbHVu/dGVlcmlzbS1vdXRk/b29yLWNsZWFudXAt/Y29tbXVuaXR5LXNl/cnZpY2UteW91dGgt/ZW1wb3dlcm1lbnQt/Y2hhcml0YWJsZS1j/YXVzZV84NjQ1ODgt/ODk1MzkuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZA",
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "bg-gray-700" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="mt-4">
          <Header
            welcomeText="Welcome Back,"
            name={currentUser?.name}
            profileImage={{ uri: currentUser?.avatar }}
          />

          <Search
            placeholder="Type something..."
            onChangeText={handleSearch}
            onPress={() => console.log("Pressed")}
            onFocus={handleFocus}
          />

          <View className="mx-4">
            <View className={isDarkMode ? "bg-gray-800" : "bg-gray-50"}>
              <ImageSlider images={Sliderimages} autoPlayInterval={4000} />
            </View>

            <Text
              className={`text-2xl font-medium my-5 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Recommended Jobs
            </Text>

            <View className="mt-6">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  {userLocation && userProfile?.city && (
                    <Text
                      className={`text-sm ${
                        isDarkMode ? "text-white" : "text-gray-500"
                      }`}
                    >
                      📍 Jobs near {userProfile.city}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => router.push("/(seeker)/jobs")}>
                  <Text className="text-blue-500 font-medium">View All</Text>
                </TouchableOpacity>
              </View>

              {nearbyJobs.length === 0 ? (
                <View
                  className={`rounded-2xl p-6 items-center ${
                    isDarkMode ? "bg-gray-500" : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-sm mt-2 ${
                      isDarkMode ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Try updating your location in profile
                  </Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row">
                    {nearbyJobs.map((job) => (
                      <View
                        key={job.$id}
                        className="mr-3 relative"
                        style={{ width: 280 }}
                      >
                        <JobCard
                          title={toSentenceCase(job.title || "Untitled Job")}
                          price={job.pay || "N/A"}
                          duration={
                            job.startDate
                              ? new Date(job.startDate).toLocaleDateString()
                              : "Not specified"
                          }
                          location={`${toSentenceCase(
                            job.city || "Unknown"
                          )}, ${toSentenceCase(job.state || "")}`}
                          peopleNeeded={job.peopleNeeded || "1"}
                          icon={job.avatarUrl}
                          userName={job.userName}
                          backgroundColor={
                            isDarkMode ? "bg-gray-300" : "bg-blue-100"
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
                </ScrollView>
              )}
            </View>
          </View>
        </View>

        {/* Floating Add Button */}
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-20 h-20 rounded-full justify-center items-center shadow-lg mb-6"
          // style={{
          //   backgroundColor: isDarkMode ? "#4f46e5" : "#6366f1",
          // }}
          onPress={() => setIsChatOpen(true)}
          activeOpacity={0.8}
        >
          <Image
            source={images.chat}
            className="w-full h-full rounded-full"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <GeminiChatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
