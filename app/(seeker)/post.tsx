import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function PostJobScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [pay, setPay] = useState("");

  const handlePostJob = () => {
    if (!title || !description || !category || !location || !dateTime || !pay) {
      alert("Please fill all fields");
      return;
    }
    console.log({
      title,
      description,
      category,
      location,
      dateTime,
      pay,
    });
    alert("Job Posted Successfully ✅");
    router.back(); // go back to jobs page
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 py-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Post a Job</Text>

        {/* Job Title */}
        <Text className="text-base font-semibold mb-2">Job Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter job title"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        />

        {/* Job Description */}
        <Text className="text-base font-semibold mb-2">Job Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter job description"
          multiline
          numberOfLines={4}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        />

        {/* Category */}
        <Text className="text-base font-semibold mb-2">Category</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          placeholder="E.g. Babysitting, Plumber, Tutor"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        />

        {/* Location */}
        <Text className="text-base font-semibold mb-2">Location</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Enter location"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        />

        {/* Date & Time */}
        <Text className="text-base font-semibold mb-2">Date & Time</Text>
        <TextInput
          value={dateTime}
          onChangeText={setDateTime}
          placeholder="Enter date & time"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 text-base"
        />

        {/* Pay */}
        <Text className="text-base font-semibold mb-2">Pay</Text>
        <TextInput
          value={pay}
          onChangeText={setPay}
          placeholder="Enter pay"
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handlePostJob}
          className="bg-blue-500 rounded-lg py-4 items-center"
        >
          <Text className="text-white font-bold text-lg">Post Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
