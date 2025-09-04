import Header from "@/components/Header";
import Search from "@/components/Search";
import ImageSlider from "@/components/ImageSlider";
import JobCard from "@/components/JobCard";
import { images } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

const Home = () => {
  const Sliderimages = [
    "https://imgs.search.brave.com/TLtgFv9OolO-j3s4jBwVjhTZsaX5n9RnqdaHwIYe95o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdC5k/ZXBvc2l0cGhvdG9z/LmNvbS8xMDIxMDEy/LzEzMzQvaS80NTAv/ZGVwb3NpdHBob3Rv/c18xMzM0Njk4Ni1z/dG9jay1waG90by1j/b25zdHJ1Y3Rpb24t/d29ya2Vycy13b3Jr/aW5nLW9uLWNlbWVu/dC5qcGc",
    "https://imgs.search.brave.com/gLqMJG_IOKQ37ZRN-TXqgEyuM94T8rUoso8vc3Qw3qM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9lbXBsb3llZXMt/M2QtZmxhdC1pY29u/LXZvbHVudGVlcmlu/Zy1jb21tdW5pdHkt/Y2xlYW51cHMtY3Ny/LWluaXRpYXRpdmUt/cHJvbW90aW5nLWVu/dmlyb25tZW5fOTgw/NzE2LTE3OTIyNy5q/cGc_c2VtdD1haXNf/aHlicmlk",
    "https://imgs.search.brave.com/Ga4HBrwZk6gz6VVyvesgGIBSbP0tGzP2xFAl78VISLk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/Y293b3JraW5nLXNw/YWNlLWlsbHVzdHJh/dGlvbi13aXRoLXBl/b3BsZS1vZmZpY2Vf/MjMtMjE0ODgyOTA5/Ni5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw",
    "https://imgs.search.brave.com/9tiqy5sDBLwEqvkuN0cdgzHasV4p25u20nrxBdjpf6E/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by90ZWFtLWNvbW11/bml0eS1jbGVhbmVy/cy13b3JrZW5nLXRv/Z2V0aGVyXzEzODc2/MTQtNDc3NC5qcGc_/c2VtdD1haXNfaHli/cmlk",
  ];

  const quickJobs = [
    {
      title: 'Grass Cutting',
      description: '24 sq ft',
      price: '10.00',
      duration: '1 Aug',
      icon: images.worker,
      backgroundColor: 'bg-green-100',
    },
    {
      title: 'BabySitter for 1 day',
      description: '2 Child',
      price: '15.00',
      duration: '1 Aug',
      icon: images.women,
      backgroundColor: 'bg-purple-100',
    },
    {
      title: 'BabySitter for 1 day',
      description: '2 Child',
      price: '15.00',
      duration: '1 Aug',
      icon: images.women,
      backgroundColor: 'bg-purple-100',
    },
    {
      title: 'Grass Cutting',
      description: '24 sq ft',
      price: '10.00',
      duration: '1 Aug',
      icon: images.worker,
      backgroundColor: 'bg-green-100',
    },
  ];

  const navigation = useNavigation();
  const handleSearch = () => console.log("Searching...");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="mt-4 px-4">
          <Header
            welcomeText="Welcome Back,"
            name="Harry Potter"
            profileImage={images.man}
          />

          <Search
            placeholder="Type something..."
            onChangeText={handleSearch}
            onPress={() => console.log("Pressed")}
          />

          <ImageSlider images={Sliderimages} autoPlayInterval={6000} />

          <Text className="text-2xl text-gray-800 font-medium my-5">
            Recommended Jobs
          </Text>

          {/* Job Grid - 2 per row */}
          <View className="flex flex-row flex-wrap justify-between">
            {quickJobs.map((job, index) => (
              <View
                key={index}
                className="w-[48%] mb-4"
              >
                <JobCard
                  {...job}
                  onPress={() => console.log("Job pressed:", job.title)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
