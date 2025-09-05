import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

import Search from "@/components/Search";
import JobCard from "@/components/JobCard";
import { images } from "@/constants";
import { useRouter } from "expo-router";

export default function jobs() {
  const router = useRouter();
  const quickJobs = [
    {
      title: "Grass Cutting",
      description: "24 sq ft",
      price: "10.00",
      duration: "1 Aug",
      icon: images.worker,
      backgroundColor: "bg-green-100",
    },
    {
      title: "BabySitter for 1 day",
      description: "2 Child",
      price: "15.00",
      duration: "1 Aug",
      icon: images.women,
      backgroundColor: "bg-purple-100",
    },
  ];

  const areaJobs = [
    {
      title: "Grass Cutting",
      description: "24 sq ft",
      price: "10.00",
      duration: "1 Aug",
      icon: images.worker,
      backgroundColor: "bg-gray-200",
    },
    {
      title: "BabySitter for 1 day",
      description: "2 Child",
      price: "15.00",
      duration: "1 Aug",
      icon: images.women,
      backgroundColor: "bg-gray-200",
    },

    {
      title: "Grass Cutting",
      description: "24 sq ft",
      price: "10.00",
      duration: "1 Aug",
      icon: images.worker,
      backgroundColor: "bg-gray-200",
    },
    {
      title: "BabySitter for 1 day",
      description: "2 Child",
      price: "15.00",
      duration: "1 Aug",
      icon: images.women,
      backgroundColor: "bg-gray-200",
    },
  ];

  const longJobs = [
    {
      title: "Grass Cutting",
      description: "24 sq ft",
      price: "10.00",
      duration: "1 Aug",
      icon: images.worker,
      backgroundColor: "bg-green-100",
    },
    {
      title: "BabySitter for 1 day",
      description: "2 Child",
      price: "15.00",
      duration: "1 Aug",
      icon: images.women,
      backgroundColor: "bg-purple-100",
    },
  ];

  const handleSearch = () => console.log("Searching...");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="mt-4 px-4">
          <Search
            placeholder="Type something..."
            onChangeText={handleSearch}
            onPress={() => console.log("Pressed")}
          />

          <Text className="text-2xl text-gray-800 font-medium my-5">
          Recommended Jobs
        </Text>
        
        <View className="flex flex-row flex-wrap justify-between">
          {quickJobs.map((job, index) => (
            <View key={index} className="w-[48%] mb-4">
              <JobCard
                {...job}
                onPress={() => router.push("../supportPages/jobDetails")}
              />
            </View>
          ))}
        </View>

        <Text className="text-2xl text-gray-800 font-medium my-5">
          In Your Area
        </Text>

        <View className="flex flex-row flex-wrap justify-between">
          {areaJobs.map((job, index) => (
            <View key={index} className="w-[48%] mb-4">
              <JobCard
                {...job}
                onPress={() => router.push('./supportPages/jobDetails')}
              />
            </View>
          ))}
        </View>

         <Text className="text-2xl text-gray-800 font-medium my-5">
          Long Term Jobs
        </Text>

        <View className="flex flex-row flex-wrap justify-between">
          {longJobs.map((job, index) => (
            <View key={index} className="w-[48%] mb-4">
              <JobCard
                {...job}
                onPress={() => router.push('./supportPages/jobDetails')}
              />
            </View>
          ))}
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
