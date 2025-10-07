import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";
import JobCard from "@/components/JobCard";
import Search from "@/components/Search";
import { images } from "@/constants";
import { getCurrentUser } from "@/lib/appwrite";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();
  const navigation = useNavigation(); // moved above return
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
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
            welcomeText="Welcome Back,"
            name={
              user?.name
                ? user.name.charAt(0).toUpperCase() +
                  user.name.slice(1).toLowerCase()
                : ""
            }
            profileImage={{ uri: user.avatar }}
          />

          <Search
            placeholder="Type something..."
            onChangeText={handleSearch}
            onPress={() => console.log("Pressed")}
            onFocus={handleFocus}
          />

          <View className="mx-4">
            <ScrollView className="flex-1 bg-gray-50">
              <ImageSlider images={Sliderimages} autoPlayInterval={6000} />
              {/* Other content here */}
            </ScrollView>

            <Text className="text-2xl text-gray-800 font-medium my-5">
              Recommended Jobs
            </Text>

            {/* Job Grid - 2 per row
            <View className="flex flex-row flex-wrap justify-between">
              {quickJobs.map((job, index) => (
                <View key={index} className="w-[48%] mb-4">
                  <JobCard
                    {...job}
                    onPress={() => router.push("./supportPages/jobDetails")}
                  />
                </View>
              ))}
            </View> */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
