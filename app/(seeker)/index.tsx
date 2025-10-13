import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";
import Search from "@/components/Search";
import JobCard from "@/components/JobCard";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import {
  getAllJobs,
  getCurrentUser,
  getWorkerProfileByUserId,
} from "@/lib/appwrite";
import {
  getCityCoordinates,
  sortJobsByDistance,
  filterJobsByRadius,
} from "@/utils/locationUtils";

// ✅ Move interface OUTSIDE component
interface Job {
  $id: string;
  $sequence?: number;
  $collectionId?: string;
  $databaseId?: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { t } = useTranslation();
  const { lang, setLanguage } = useLanguage();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [nearbyJobs, setNearbyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number; lon: number} | null>(null);

  useEffect(() => {
    loadUserAndJobs();
  }, []);

  const loadUserAndJobs = async () => {
    try {
      setLoading(true);

      // 1. Get current user
      const user = await getCurrentUser();
      // console.log('✅ User loaded:', user);
      setCurrentUser(user);

      // 2. Get user's worker profile (which has location)
      const profile = await getWorkerProfileByUserId(user.accountId);
      // console.log('✅ Profile loaded:', profile);
      setUserProfile(profile);

      // 3. Get user's coordinates
      let userCoords = null;

      if (profile?.city) {
        // Use city from profile
        userCoords = getCityCoordinates(profile.city);
        // console.log('📍 Coordinates from city:', userCoords);
      }
      
      // If no city coordinates, try device location
      if (!userCoords) {
        const deviceLocation = await getUserDeviceLocation();
        if (deviceLocation) {
          userCoords = {
            lat: deviceLocation.coords.latitude,
            lon: deviceLocation.coords.longitude,
          };
          // console.log('📍 Coordinates from device:', userCoords);
        }
      }

      setUserLocation(userCoords);

      // 4. Fetch all jobs
      const jobs = await getAllJobs();
      // console.log('✅ All jobs fetched:', jobs.length);
      // console.log('✅ Sample job structure:', JSON.stringify(jobs[0], null, 2));
      
      // Map jobs to ensure proper structure
      const mappedJobs = jobs.map((job: any) => ({
        $id: job.$id,
        title: job.title || job.jobTitle || '',
        pay: job.pay || job.salary || job.payment || '',
        startDate: job.startDate || job.date || '',
        city: job.city || job.location?.city || '',
        state: job.state || job.location?.state || '',
        peopleNeeded: job.peopleNeeded || job.workers || '1',
        avatarUrl: job.avatarUrl || job.avatar || job.userAvatar || '',
        userName: job.userName || job.postedBy || job.employer || '',
        ...job
      })) as Job[];

      console.log('✅ Mapped job structure:', JSON.stringify(mappedJobs[0], null, 2));
      setAllJobs(mappedJobs);

      // 5. Filter and sort by distance
      if (userCoords) {
        // Filter jobs that have valid city and state
        const validJobs = mappedJobs.filter((job: Job) => {
          const hasCity = Boolean(job.city);
          const hasState = Boolean(job.state);
          // console.log(`Job "${job.title}": city=${job.city}, state=${job.state}, valid=${hasCity && hasState}`);
          return hasCity && hasState;
        });
        
        if (validJobs.length === 0) {
          console.log('⚠️ No jobs have valid location data');
          setNearbyJobs(mappedJobs.slice(0, 2));
          return;
        }
        
        // First sort all jobs by distance
        const sortedJobs = sortJobsByDistance(
          validJobs,
          userCoords.lat,
          userCoords.lon
        );
        
        console.log('✅ After sorting, jobs with distances:', sortedJobs.slice(0, 3).map(j => ({
          title: j.title,
          city: j.city,
          distance: j.distance
        })));
        
        // Then filter by radius (30km)
        const nearby = filterJobsByRadius(
          sortedJobs,
          userCoords.lat,
          userCoords.lon,
          30
        );
        
        setNearbyJobs(nearby.slice(0, 2));
      } else {
        console.log('⚠️ No location, showing first 3 jobs');
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
      if (status !== "granted") {
        console.log("Location permission denied");
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      return location;
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
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#6366f1" />
        <Text className="text-gray-600 mt-4">Loading...</Text>
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="mt-4">
          <Header
            welcomeText={t("Welcome Back,")}
            name={
              currentUser?.name
                ? currentUser.name.charAt(0).toUpperCase() +
                  currentUser.name.slice(1).toLowerCase()
                : ""
            }
            profileImage={{ uri: currentUser?.avatar }}
          />

          <Search
            placeholder="Type something..."
            onChangeText={handleSearch}
            onPress={() => console.log("Pressed")}
            onFocus={handleFocus}
          />

          <View className="mx-4">
            <View className="bg-gray-50">
              <ImageSlider images={Sliderimages} autoPlayInterval={4000} />
            </View>

            <Text className="text-2xl text-gray-800 font-medium my-5">
              {t("Recommended Jobs")}
            </Text>

            {/* Recommended Jobs (Nearby) */}
            <View className="mt-6">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  {userLocation && userProfile?.city && (
                    <Text className="text-sm text-gray-500">
                      📍 Jobs near {userProfile.city}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => router.push("/(seeker)/jobs")}>
                  <Text className="text-indigo-600 font-medium">View All</Text>
                </TouchableOpacity>
              </View>

              {nearbyJobs.length === 0 ? (
                <View className="bg-gray-50 rounded-2xl p-6 items-center">
                  <Text className="text-gray-500 text-sm mt-2">
                    Try updating your location in profile
                  </Text>
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row">
                    {nearbyJobs.map((job: Job) => (
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
                          backgroundColor="bg-blue-100"
                          onPress={() =>
                            router.push({
                              pathname: "../supportPages/jobDetails",
                              params: { jobId: job.$id },
                            })
                          }
                        />
                        {/* Distance Badge */}
                        {/* {job.distance !== undefined && (
                          <View className="absolute top-2 right-2 bg-indigo-600 px-2 py-1 rounded-full">
                            <Text className="text-white text-xs font-semibold">
                              📍 {job.distance.toFixed(1)} km
                            </Text>
                          </View>
                        )} */}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;