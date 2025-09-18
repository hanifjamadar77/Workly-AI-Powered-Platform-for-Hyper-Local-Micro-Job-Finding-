import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter} from "expo-router";

export default function IntroPage2() {
    const router = useRouter();

   const handleNext = () => {
    router.replace('/IntroPage3');
  };

  const handleSkip = () => {
    router.replace('/(seeker)')
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Character Image */}
        <View className="w-48 h-48 bg-blue-500 rounded-full justify-center items-center mb-12 shadow-lg">
          <View className="w-32 h-32 bg-white rounded-full justify-center items-center">
            <Text className="text-6xl">👨‍💼</Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
          Browse jobs list
        </Text>

        {/* Description */}
        <Text className="text-base text-gray-600 text-center leading-6 px-8 mb-12">
          Our job list include professional ones, so you can find the best job for you
        </Text>
      </View>

      {/* Bottom Section */}
      <View className="px-6 pb-8">
        {/* Page Indicators */}
        <View className="flex-row justify-center items-center mb-8">
          <View className="w-2 h-2 rounded-full bg-gray-300 mx-1" />
          <View className="w-2 h-2 rounded-full bg-orange-500 mx-1" />
          <View className="w-2 h-2 rounded-full bg-gray-300 mx-1" />
          <View className="w-2 h-2 rounded-full bg-gray-300 mx-1" />
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-between items-center">
          <TouchableOpacity
            className="bg-gray-200 px-8 py-4 rounded-2xl flex-1 mr-4"
            onPress={handleSkip}
          >
            <Text className="text-gray-700 text-center text-base font-medium">
              Skip
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-orange-500 px-8 py-4 rounded-2xl flex-1 ml-4 shadow-sm"
            onPress={handleNext}
          >
            <Text className="text-white text-center text-base font-semibold">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}